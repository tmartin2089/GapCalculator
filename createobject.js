/* -------------------------Table of Contents-------------------------
	Howto -	Ctrl-F for the caret and # you want i.e. "^2" for bio functions  
  ^1 - Higher order variables - cached at top of anon function b/c they will be used multiple places 
  ^2 - DRY functions
  ^3 - Gathers and parses bio information - budget/pc/sc/st res gift
  ^4 - This section gathers and parses p6 paste into a useful object
  ^5 - Need/Cost Overage determination
  ^6 - DOM display of updated amounts
  ^7 - 
  ^8 -
 
 */

 //helpful functions - determine noneedbasedAid - if so skip all need calcs
 //helpful function - total NBA less than need - skip need redux entirely

"use strict";



/*
$('#paste').keyup(function() {
	console.log("Ajax stuff is happening here sire");
	var searchField = $('#paste').val();
	console.log(searchField);
	var ky = document.getElementById("paste").val;
	console.log(ky);
	var myExp = new RegExp(searchField, "i");
	$.getJSON('datafile.json', function(data) {
		$.each(datafile, function(key, val) {
			if ((val.name.search(myExp) != -1) ||
			(val.bio.search(myExp) != -1)) {
				output += '<li>';
				output += '<h2>'+ val.name +'</h2>';
				output += '<img src="images/'+ val.shortname +'_tn.jpg" alt="'+ val.name +'" />';
				output += '<p>'+ val.bio +'</p>';
				output += '</li>';
			}
		});
		output += '</ul>';
		$('#update').html(output);
	}); //get JSON
});
*/



var doAidmagic = (function(){

	// ^1 -----------------------------Useful Higher Order Variables------------------------------------
	
	//this is the processed aid object that we will be referencing so we don't keep calling the function like in the bad old days
	var aidObject = new RunitThrough(newgetPaste());
	console.log(aidObject);
	//duplicate array for revision purposes
	var revisionObject = new RunitThrough(newgetPaste());
	console.log(revisionObject);
	//total amount of need based aid
	var totalNeedamount = additUp(aidObject, "need");
	
	//total amount of aid
	var totalAidamount = additUp(aidObject, "cost");

	//bio Array  - bio[0] = coa - might just be easier to get by id# rather than running the entire array
	//bio[0] = cost, bio[1] = sc, bio[2] = pc, bio[3] = resources
	var bioObject = gatherBio();

	//total resources (pc, sc and osch)
	var bioResources = additUp(gatherBio());
	
	//total cost
	var costofa = bioObject[0];

	//check if sacred (entitlements) only
	var sacredOnly = aidObject.every(function(element){
		return element.sacred;
	});
	
	var sacredAmt = aidObject.filter(function(i){
		if(i.sacred){
			return i;
		}
	});
	
	var sacredTotal = additUp(sacredAmt, "need");
	console.log(sacredTotal);
	
	//entitlements only - skip all calcs
	if(sacredOnly && aidObject.length >= 1){
		return displayUpdatedamts();
	}
	//entitlements + outside scholarships > COA - zero out all else
	else if(sacredTotal + bioObject[3] >= costofa){
		$.each(revisionObject,function(){
			if(!this.sacred){
				this.amount = 0;
			}
		});
		return displayUpdatedamts();
	}
	
	// ^2 -------------------------------DRY Functions-----------------------------------
	//generic totalling function - depending on flag can calc total NBA, total cost aid, or no flag =  bio resources

	function additUp(aid, flag){
		var total = 0;
		$.each(aid, function(){
			//add up only NB aid
			if(flag === "need"){
				if(this.needBased){
					total += this.amount; 
				}
			}
			//add it all up
			else if(flag === "cost"){
				total += this.amount;
			}
			//no flag - sum up bio resources
			else{
				total = aid[1] + aid[2] + aid[3];
			}
		});
		return total;
	};	
	
	//takes a presorted array & overage and reduces by amount of overage
	//if need overage > available need to reduce - termination case fires - this is not preferred behaviour as this ignores costeval()
	function revisionCalculation(array, overage, x, flag){
		var x = x;
		var total = overage;
		var length = array.length-1;
		//termination
		if(total < 0 || x > length){
			//if still overage and all aid has been reduced, x > length should catch it
			if(flag === "need"){
				return costEval();
			}
			else if(flag === "cost"){
				return displayUpdatedamts();
			}
		}
		//base - fires if remaining overage is less than next aid item
		if(total < array[x].amount){
			array[x].amount -= total;
			if(flag === "need"){
				return costEval();
			}
			else if(flag === "cost"){
				return displayUpdatedamts();		
			}
		}
		//other base 
		if(total === 0){
			if(flag === "need"){
				return costEval();
			}
			else if(flag === "cost"){
				return displayUpdatedamts();		
			}
		}
		total -= array[x].amount;
		array[x].amount = 0;
		return revisionCalculation(array, total, x+1, flag);
	}
	
	
	// ^3 -------------------------------Bio Information-----------------------------------
	function gatherBio(){
		var bio = [];
		$('.bio').each(function(index){
			//NaN = falsey 
			if(parseInt($(this).val())){
				bio.push(parseInt($(this).val()));
			}
			else{
				bio.push(0);
			}
		});
		return bio;
	}
	
	
	// ^4 -------------------------------P6 Paste Information Parsers-----------------------------------			
	//couldn't I just do an arguments.filter(){return words excluded & no top 10} gather p6 paste information and clean it up
	function newgetPaste(){
		var pasted = $('.paste').val().replace(/_/g,' ').split(' '); //remove underscores and splits into array
		var pastedArray = [];
		var pastedArray2 = [];
		//excludes non-numerical values (gets rid of text) and makes sure the 10 in "Top 10" isn't counted as an amount
		$.each(pasted,function(){
			if(parseInt(this)	&&	(parseInt(this)	>	10)){ 							
				pastedArray.push(parseInt(this));
			}
		});
		//convert into prelim object array for later conversionObject
		//added as separate each statement for ease of comprehension/I really dont want to put together a longer boolean in the above
		//position:index - this lets us track position of original array so we can re-order revision array for easier to read purposes on display
		$.each(pastedArray,function(index){
			//even indexes will be award codes, odd will be amounts
			if((index % 2) === 0){
				pastedArray2.push({type:this, value:pastedArray[index+1], position: index});
			}
		}); 
		//convert all OSFS scholarships to same type
		$.each(pastedArray2,function(index){
			var testVar = this.type;
				//convert osfs scholarships to general award code (many awd codes, all treated the same)
				if(testVar.toString().substring(0,3)==="331" || testVar.toString().substring(0,3)==="341"){
					pastedArray2[index].type = 331000;
				}				
		});
		return pastedArray2;	
	}

	//convert p6 array input through object literal call - richer return than switch statement
	//constructs aid object array
	function RunitThrough(thingy){
		var k = [];
		$.each(thingy, function(){
			k.push(convertAid(this.type, this.value, this.position));
		});
		//filters out undefined values generated by no match <oschs>
		k = k.filter(function(x){
			return (x);
		});
		return k;
	}

	
	// ^5 -------------------------------Need/Cost Booleans-----------------------------------
	//determine overage || jump to cost if no need aid/overage
	function determineNeed(){
		var needAid = false;
		var needOverage;
		$.each(aidObject,function(){
			if(this.needBased){
				needAid = true;
				//to break out of $.each
				return false;
			}
		});	
		//evaluates $.each result
		if(!needAid){
			//no need aid - jump to cost eval
			return costEval();
		}
		else{
			//there is NBA - evaluate for possible overage
			needOverage = (bioObject[0] - bioResources) - totalNeedamount;
			//should be negative number if overage
			needRevisions(needOverage);
		}
	}
	
	
	//should check if need revisions are needed - if not jump to costEval()
	function needRevisions(amount){
		if(amount >= 0){
			//negative number means there is a need overage, so if > 0 there is no overage, jump to cost
			return costEval();
		}
		//
		else if(amount < 0){
			doNeedmath(Math.abs(amount)); //convert negative to positive for doNeedmath()
		}
	}
	
	//amount === need overage amount
	function doNeedmath(amount){
		//overage is greater than total grants
		if(amount >= totalNeedamount){
			$.each(revisionObject,function(){
				if(this.needBased && !this.sacred){
					this.amount = 0;
				}
			});
			return costEval(revisionObject);
		}
		//overage exists, but is less than total grants - redux needed but not to all !sacred aid
		else if(amount < totalNeedamount){
			//sort by needRank and filter out non-need && sacred 
			var sorted = revisionObject.sort(function(a,b){return a.needRank - b.needRank}).filter(function(aid){
				if(aid.needBased && !aid.sacred){
					return aid.type;
				}
			});
			return revisionCalculation(sorted, amount, 0, "need");
		}	//filter out into array, then reset revision array to match?  no - refilter and slice those index values, then concat the sliced revisionObject with the new filtered values
	}

	//jumped straight to if determineNeed returns false
	//jumped to if no need overage
	function costEval(){
		//total remaining aid after need revisions
		var k = additUp(revisionObject, "cost");
		var remainingCost = costofa - bioObject[3];
		//arrange by costRank and exclude sacred
		var sorted = revisionObject.sort(function(a,b){return a.costRank - b.costRank}).filter(function(aid){
			if(!aid.sacred){
				return aid.type;
			}
		});
		if(k > remainingCost){
			k -= remainingCost;
			return revisionCalculation(sorted, k, 0, "cost");
		}
		return displayUpdatedamts();
	}
	
	// ^6 -------------------------------DOM display of updated amounts-----------------------------------	
	function displayUpdatedamts(){
		var length = revisionObject.length;
		var revisionObjectsorted = revisionObject.sort(function(a,b){return a.position - b.position});
		for(var x = 0; x < length; x++){
			if(aidObject[x].amount != revisionObject[x].amount){
				var k = aidObject[x].amount - revisionObject[x].amount;
				$('#results').append('<div class="changedAid"> <p>' + revisionObject[x].type + '</p><p>Need to return: $' + k + '</p></div>').css("display","block");
			}
			else{
				$('#results').append('<div class="updated"> <p>' + revisionObject[x].type + '</p><p>Amount Remains: $' + revisionObject[x].amount + '</p></div>').css("display", "block");
			}		
		}
	}


determineNeed();

	
});   //end doAidmagic()

  var el = document.getElementById('calc');
  el.addEventListener('click',doAidmagic);

  var el2 = document.getElementById('clear');
  el2.addEventListener('click', clearResult);


function clearResult(){
	document.getElementById("bio").reset();
	$('#results').empty();
}

