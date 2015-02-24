/* -------------------------Table of Contents-------------------------
	Howto -	Ctrl-F for the caret and # you want i.e. "^2" for bio functions  
  ^1 - Higher order variables - cached at top of anon function b/c they will be used multiple places 
  ^2 - DRY functions
  ^3 - Gathers and parses bio information - budget/pc/sc/st res gift
  ^4 - This section gathers and parses p6 paste into a useful object
  ^5 - Need calculations - is skipped if no NB aid
  ^4 - 
  ^5 - 
  ^6 -
  ^7 - 
  ^8 -
 
 */

 
 //helpful functions - determine onlysacredAid?  if so - skip all calcs 
 //helpful functions - determine noneedbasedAid - if so skip all need calcs
 //helpful function - total NBA less than need - skip need redux entirely
//filter out by needBased and !sacred works great, but consider making it a function you can call anywhere



"use strict";

//global === bad bad dev, let mama mytestScope protect your pretty variables in her safe scoped arms
var mytestScope = (function(){

	// ^1 -----------------------------Useful Higher Order Variables------------------------------------
	
	//this is the processed aid object that we will be referencing so we don't keep calling the function like in the bad old days
	var aidObject = runitThrough(newgetPaste());
	console.log(aidObject);
	
	//duplicate array for revision purposes
	var revisionObject = new runitThrough(newgetPaste());
	console.log(revisionObject);
	
	//total amount of need based aid
	var totalNeedamount = additUp(aidObject, "need");
	console.log(totalNeedamount);
	
	//total amount of aid
	var totalAidamount = additUp(aidObject, "cost");
	//console.log(totalAidamount);
	
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
	
	//jump straight to dom update - no need to update aid
	if(sacredOnly){
		console.log("sacred aid only - jump to DOM manipulation");
		return;
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
		})
		return total;
	};	
	
	//takes a presorted array & overage and reduces by amount of overage
	function revisionCalculation(array, overage, x, flag){
		var x = x;
		var total = overage;
		var length = array.length-1;
		//termination
		if(total < 0 || x > length){
			return;
		}
		//base - fires if remaining overage is less than next aid item
		if(total < array[x].amount){
			array[x].amount -= total;
			if(flag === "need"){
				console.log("just fired");
				return costEval();
			}
			else if(flag === "cost"){
				console.log(JSON.stringify(revisionObject));
			return domChanges();		
			};
		};
		//other base 
		if(total === 0){
			return;
		};
		total -= array[x].amount;
		array[x].amount = 0;
		return revisionCalculation(array, total, x+1, flag);
	};
	
/*
	function lookitUP(){
		for(var x = 0; x < revisionObject.length; x++){
			console.log(revisionObject[x]);
		}	
		console.log(JSON.stringify(revisionObject));
	}
*/
	
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

	
	//couldn't I just do an arguments.filter(){return words excluded & no 10 and  }

	//gather p6 paste information and clean it up
	function newgetPaste(){
		var pasted = $('.paste').val().replace(/_/g,' ').split(' '); //remove underscores and splits into array
		var pastedArray = [];
		var pastedArray2 = [];
		//excludes non-numerical values (gets rid of text) and makes sure the 10 in "Top 10" isn't counted as an amount
		$.each(pasted,function(){
			if(parseInt(this) && (parseInt(this) > 10)){ 							
				pastedArray.push(parseInt(this));
			}
		});
		//convert into prelim object array for later conversionObject
		//added as separate each statement for ease of comprehension/I really dont want to put together a longer boolean in the above
		$.each(pastedArray,function(index){
			//even indexes will be award codes, odd will be amounts
			if((index % 2) === 0){
				pastedArray2.push({type:this, value:pastedArray[index+1]});
			}
		}); 
		//convert all OSFS scholarships to same type
		$.each(pastedArray2,function(index){
			var testVar = this.type;
				//convert osfs scholarships to general award code (many awd codes, all treated the same)
				if(testVar.toString().substring(0,3)==="331" || testVar.toString().substring(0,3)==="341"){
					pastedArray2[index].type = 331000;
				};				
		});
		return pastedArray2;	
	}

	//convert p6 array input through object literal call - richer return than switch statement
	function runitThrough(thingy){
		var k = [];
		$.each(thingy, function(){
			k.push(convertAid(this.type, this.value));
		})
		//filters out undefined values generated by no match <oschs>
		k = k.filter(function(x){
			return (x);
		})
		return k;
	};
	
	//generic totalling function - depending on flag can calc total NBA, total cost aid, or
	//no flag =  bio resources

	
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
		};
	};
	
	//next up - need overage?  then reduce in order of need rank until need overage is fixed
	//should just copy new aid object (something something scope)
	
	//should check if need revisions are needed - if not jump to costEval()
	function needRevisions(amount){
		if(amount >= 0){
			//need is fine, jump to cost
			return costEval(amount);
		}
		//
		else if(amount < 0){
			doNeedmath(Math.abs(amount)); //convert negative to positive for doNeedmath()
		};
	};
	
	//amount === need overage amount
	function doNeedmath(amount){
		//overage is greater than total grants
		if(amount > totalNeedamount){
			$.each(revisionObject,function(){
				if(this.needBased && !this.sacred){
					this.amount = 0;
					//fwd revisionObject to costEval return revisionObject;
				}
			})
		}
		//overage exists, but is less than total grants - redux needed but not to all !sacred aid
		else if(amount < totalNeedamount){
			//sort by needRank and filter out non-need && sacred 
			var sorted = revisionObject.sort(function(a,b){return a.needRank - b.needRank}).filter(function(aid){
				if(aid.needBased && !aid.sacred){
					return aid.type;
				}
			})
			console.log(sorted);
			return revisionCalculation(sorted, amount, 0, "need");
		}	//filter out into array, then reset revision array to match?  no - refilter and slice those index values, then concat the sliced revisionObject with the new filtered values
	}

	//jumped straight to if determineNeed returns false
	//jumped to if no need overage
	function costEval(){
		//total remaining aid after need revisions
		var k = additUp(revisionObject, "cost");
		//arrange by costRank and exclude sacred
		var sorted = revisionObject.sort(function(a,b){return a.costRank - b.costRank}).filter(function(aid){
			if(!aid.sacred){
				return aid.type;
			}
		})
		console.log(sorted);
		if(k > costofa){
			k -= costofa;
			return revisionCalculation(sorted, k, 0, "cost");
		};
	}
	
	function domChanges(){
		console.log("im doing shit to the DOM yo!");
	}

determineNeed();
//lookitUP();
	
});   //end mytestScope


$('#onf').on("click",function(){
		mytestScope();	
});
