/* -------------------------Table of Contents-------------------------
	Howto -	Ctrl-F for the caret and # you want i.e. "^2" for bio functions  
  ^1 - This section gathers and parses p6 paste into a useful object
  ^2 - Gathers and parses bio information - budget/pc/sc/st res gift
  ^3 - Calculates need/this is skipped if no NB aid
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

//this is the processed aid object that we will be referencing so we don't keep calling the  function like in the bad old days
	var aidObject = runitThrough(newgetPaste());
	console.log(aidObject[0].needRank);
	
	var sortme = aidObject.sort(function(a,b){return a.needRank - b.needRank})
	console.log(sortme);
	console.log(sortme[0]);
	
	//duplicate array for revision purposes
	var revisionObject = new runitThrough(newgetPaste());
	
	//total amount of need based aid
	var totalNeedamount = additUp(aidObject, "need");
	
	//total amount of aid
	var totalAidamount = additUp(aidObject, "cost");
	
	//resources (pc, sc and osch)
	var bioResources = additUp(gatherBio());



	//gather bio info
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
	
	//couldn't I just do an arguments.filter(){return words excluded & no 10 and  }

	//gather p6 paste information and clean it up
	function newgetPaste(){
		//clean up your input
		var pasted = $('.paste').val().replace(/_/g,' ').split(' '); //remove underscores and splits into array
		var pastedArray = [];
		var pastedArray2 = [];
		//excludes non-numerical values from array (gets big of text)
		$.each(pasted,function(){
			if(parseInt(this) && (parseInt(this) > 10)){ //if converts to # and is larger than 10 - top 10
														//was being counted as an amt
				pastedArray.push(parseInt(this));
			}
		})
		//convert into prelim object array for later conversionObject
		//added as separate each statement for ease of comprehension/I really dont want to put together a longer boolean in the above
		
		//creates initial object array
		$.each(pastedArray,function(index){
			//even indexes will be award codes
			if((index % 2) === 0){
				pastedArray2.push({type:this, value:pastedArray[index+1]});
			}
		})
		//convert all OSFS scholarships to same type
		$.each(pastedArray2,function(index){
			var testVar = this.type;
				if(testVar.toString().substring(0,3)==="331" || testVar.toString().substring(0,3)==="341"){
					pastedArray2[index].type = 331000;
				};				
		});
		return pastedArray2;	
	}

	//needRank determines order of reduction.  Lowest needRank gets reduced first  needBased flag will be used to gather need objects only for need redux

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
		console.dir(k);
		return k;
	};
	
	//generic totalling function - depending on flag can calc total NBA, total cost aid, or
	//no flag =  bio resources
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
		console.log("the additUp amount is " + total + " for " + flag);
		return total;
	};
	
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
			//console.log(JSON.stringify(revisionObject));
		}
		//overage exists, but is less than total grants - redux needed but not to all !sacred aid
		else if(amount < totalNeedamount){
			var total = amount;
			//sort by needRank and filter out non-need && sacred 
			var sorted = revisionObject.sort(function(a,b){return a.needRank - b.needRank}).filter(function(aid){
				if(aid.needBased && !aid.sacred){
					return aid.type
				}
			});
			return needCalcs(sorted, amount, 0);
		}	//filter out into array, then reset revision array to match?  no - refilter and slice those index values, then concat the sliced revisionObject with the new filtered values
	}
	
	//recursion attempt #2
	function needCalcs(nbarray, overage, x){
		console.log(nbarray);
		var x = x;
		var total = overage;
		var runtime = 4;
		//termination
		if(total < 0){
			console.log("I should not have fired");
			return;
		};
		if(runtime === 0){
			console.log("runtime exceeded");
			return;
		}
		//base    - what if overage is less than grant being reviewed?  should also be a base case
		if(total === 0){
			console.log("should be w/in need now");
			return;
		};
		//other base case
		if(total < nbarray[x].amount){
			console.log("other base case fired");
			nbarray[x].amount = total;
			return;
		}
		//total > nba[x].amount
		console.log(nbarray[x].amount);
		total -= nbarray[x].amount;
		nbarray[x].amount = 0;
		runtime--;
		return needCalcs(nbarray, total, x+1);
		console.log(total);
		console.log(nbarray);
		//return needCalcs(nbarray, total);
	}

	
	//jumped straight to if determineNeed returns false
	//jumped to if no need overage
	function costEval(array){
		console.log(JSON.stringify(array));
	}

//bio[0] = cost, bio[1] = sc, bio[2] = pc, bio[3] = resources
var bioObject = gatherBio();
determineNeed();
console.log(bioObject);
additUp(bioObject);
	
});   //end mytestScope


$('#onf').on("click",function(){
		mytestScope();
		
});
