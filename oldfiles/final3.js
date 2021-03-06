"use strict";

//below is to auto-populate #paste.paste for testing - for future testing, put a bunch of award codes in JSON, have an AJAX call serve them //up one by one, and have them cross-checked with pre-stored numbers  - would like to be able to do rigorous testing automatically 
//instead of continuing to hope for the best with each effort.

var setp6Values = document.getElementById('paste');
setp6Values.value = "131252 UT Grant-UG  _1500.00 331384 JFDS  __2906 131110 TPEG Residen _2500.00 131200 Partial Tuit __644.00 214125 Unsub Shit __23400.00 214025 Unsub Shit __50 213003 Perksin   ___5000 342000 JFDS  __1331 111028 Pell __2500";


//populates bio windows for easy peasy testing lemon squeezy weezy breezy sneezy uhhhh queasy?  
//am I allowed to get away with breaking scheme if consonance and assonance remain intact?
var biotestArray = [13000, 1000, 2000, 3000];
var setbioValues = document.getElementsByClassName("bio");

(function(){
	$.each(setbioValues,function(index){
		this.value = biotestArray[index];
	})
}())



//event listeners rather than HTML events 
//safer from XSS attacks

  var el = document.getElementById('calc');
  el.addEventListener('click', displayupdatedAmts);

  var el2 = document.getElementById('clear');
  el2.addEventListener('click', clearResult);
  

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

//bio[0]= COA  bio[1] & bio[2] = PC and SC  bio[3] = st res gift


//calculates initial need - Coa - efc - st res
function determineNeed(){
	var bio = gatherBio();
	var cost = bio[0];
	var efc = bio[1] + bio[2];
	var stRes = bio[3];
	if(cost - efc <= 0 || (cost - efc) - stRes <= 0){
		//then there is no need
		var need = 0;
	}
	else{
		var need = (cost-efc)-stRes;
	};
	return need;
}

//totals amount of aid not including bio
function gatherAmt(){
	 var megaArray = aidObject();
	 ////(megaArray);
	 var amt = 0;
	 for(var x = 0; x < megaArray.length; x++){
		amt += megaArray[x].amt;
	 }
	 return amt;
}

//totals all aid and st res gift from bio
function totalAid(){
	//.log("totalaid just fired")
	var bio = gatherBio();
	var aid = gatherAmt() + bio[3];
	//number
	return aid;
}

//sums up total amt of need aid
function sumNeed(){
	//knowledge is power!
	var megaArray = aidObject();
	////(megaArray);
	var length = megaArray.length;
	var needAid = 0;
	for(var x = 0; x<length; x++){
		if(megaArray[x].type > 4 && megaArray[x].amt != 0){
			needAid += megaArray[x].amt;
		}
		else{
			needAid += 0;
		}
	};
	//number
	////(needAid);
	return needAid;
}


//total aid - total nb aid = nonneed aid total
function sumNonNeed(){
	return gatherAmt() - sumNeed();
}


//subtracts total need based aid from Fed Need  
function checkNeed(){
	var k = determineNeed() - sumNeed();
	//(k);
	return determineNeed() - sumNeed();
	//if negative, then over need
	//if positive or 0, then under or at need
}

//separate need based loans into array for need revisions (loans first)
function needbasedLoans(){
	var megaArray = aidObject();
	var needLoans = [];
	var length = megaArray.length;
	for(var i= 0; i < length; i++){
		var megaArrayLoop = megaArray[i];
		if(megaArrayLoop.type === 5 || megaArrayLoop.type === 6){
			needLoans.push(megaArrayLoop);
		}
	}
	//sort so perkins can be reduced before sub
	needLoans.sort(function(a,b){return a.type - b.type});
	//object array
	//(needLoans);
	return needLoans;
}

//sums up total amt of need based loans
function nbloanamt(){
	var needLoans = needbasedLoans();
	var needLoansAmt = 0;
	var length = needLoans.length;
	for(var i= 0; i < length; i++){
		needLoansAmt += needLoans[i].amt;
	}
	//(needLoansAmt);
	return needLoansAmt;
}

//if an overage exists - set all NB loan amounts to = 0
function reviseLforNeed(){
	//if need is positive, no overage, if negative, overage bc subtracting
	//total nb aid from need
	//("I just fired");
	var need = checkNeed();
	//(need);
	//array of need based loans
	var needLoans = needbasedLoans();
	var length = needLoans.length;
	//if checkNeed/k is a positive number, need overage does not exist
	//if checkNeed/k is a negative number, need overage exists
	if(need < 0){
		for(var i = 0; i<length; i++){
			needLoans[i].amt = 0;
		}
	};
	//overage exists  - set amts to 0
	//(needLoans);
	return needLoans;
}

//checks to determine if too much was taken away
function readdLoans(){
	var need = checkNeed();
	var amount = nbloanamt();
	//if need overage is less than nb loan amt
	//then too much was taken away
	if(need <= 0 && (Math.abs(need)) < amount){
		var readd = amount - Math.abs(need); 
	}
	else{
		var readd = 0;
	}
	//('to be readded ' + readd);
	return readd;	
}

//readds need based loans if too much was zeroed 
//this will only happen if need overage is less than total loan amt
function adjNBloans(){
	var readd = readdLoans();
	//(readd);
	var needLoans = needbasedLoans();
	//(needLoans);
	var length = needLoans.length;
	var reversed = needLoans.reverse();
	//(reversed);
	var revisedNeedloans = [];
	var total = readd;
	//(total);
	if(readd === 0){
		revisedNeedloans = reviseLforNeed();
	}
	else{
		//("second branch firing");
		for(var x=0; x < length; x++){
			if(reversed[x].amt <=  total){
				revisedNeedloans.push(reversed[x]);
				total -= reversed[x].amt;
				//(total);
			}
			else if(reversed[x].amt > total){
					reversed[x].amt = total;
					total = 0;
					revisedNeedloans.push(reversed[x]);
			}
		}
	};
	//(revisedNeedloans);
	return revisedNeedloans;
}

//will take above adjNBloans array and total new amt of nb aid 
function retotalNeed(){
	var totalNBamt = 0;
	var adjusted = adjNBloans();
	var length = adjusted.length;
	//recalls total need amt from start of function
	var need = sumNeed();
	//(need);
	//recalls total need b loan amt from start of function
	var amount = nbloanamt()
	//(amount);
	var newNeed;
	//sums up revised need amts
	for(var x = 0; x < length; x++){
		totalNBamt += adjusted[x].amt;
	}
	var newNeed = (need - amount) + totalNBamt;
	//returns new amt of need based aid
	//(newNeed);
	return newNeed;
}

//takes adjusted need amt and determines if there is an overage 
function recheckNeed(){
	//retotalNeed is totaling amount of nb aid after nb loan revisions
	var need = determineNeed() - retotalNeed();
	//(need);
	return need;
	//if need is negative, then over need
	//if need is positive, then under need
}

//duh - they're all need based, but want consistent name for a similar function
//this puts adjustable aid (non-entitlements) into array for redux for need
function needbasedGrants(){
	var megaArray = aidObject();
	var needGrants = [];
	var length = megaArray.length;
	for(var i= 0; i < length; i++){
	var megaArrayLoop = megaArray[i];
		if(megaArrayLoop.type >= 7 && megaArrayLoop.type <= 12){
			needGrants.push(megaArrayLoop);
		}
	}
	//sort in order of preferred reductions
	needGrants.sort(function(a,b){return a.type - b.type});
	//object array
	//(needGrants);
	return needGrants;
}

//gathers all grants including entitlements
function allGrants(){
	var megaArray = aidObject();
	var needGrants = [];
	var length = megaArray.length;
	for(var i= 0; i < length; i++){
		if(megaArray[i].type > 6)
		needGrants.push(megaArray[i]);
	}
	//sort in order of preferred reductions
	needGrants.sort(function(a,b){return a.type - b.type});
	//object array
	//(megaArray);
	return needGrants;
}

//totals all grants
function nbgrantamt(){
	var needGrants = allGrants();
	var needGrantsAmt = 0;
	var length = needGrants.length;
	for(var i= 0; i < length; i++){
		needGrantsAmt += needGrants[i].amt;
	}
	return needGrantsAmt;
}

//determines amt of entitlement aid
function sacredAid(){
	var grants = allGrants();
	var length = grants.length;
	var sacrosanct = 0;
	for(var i= 0; i < length; i++){
		if(grants[i].type >= 13){
			sacrosanct += grants[i].amt;
		}
	}
	return sacrosanct;
}

function sacredAidarray(){
	var grants = allGrants();
	var length = grants.length;
	var holyAid = [];
	for(var i= 0; i < length; i++){
		if(grants[i].type >= 13){
			holyAid.push(grants[i]);
		}	
	}
	return holyAid;
}


//if an overage exists - set all NB grant amounts to = 0
//only gets called if condition occurs in adjNBgrants
function reviseGforNeed(){
	//('im working');
	//if need is positive, no overage, if negative, overage
	var need = recheckNeed();
	//(need);
	//array of need based loans
	var grantArray = needbasedGrants();
	var length = grantArray.length;
	//if need is a positive number, need overage does not exist
	//if need is a negative number, need overage exists
	if(need < 0){
		for(var i = 0; i < length; i++){
			grantArray[i].amt = 0;
		}
	};
	return grantArray;
}

function readdGrants(){
	var need = recheckNeed();
	//(need);
	var nonEntit = nbgrantamt()-sacredAid();
	//if need overage is less than nb grant amt
	//then too much was taken away
	if(need < 0 && (Math.abs(need)) < nonEntit){
		var readd = nonEntit - Math.abs(need); 
	}
	else{
		var readd = 0;
	}
	return readd;	
}

//readds grants if too much was zeroed out
//this will only happen if need overage is less than total grant amt
function adjNBgrants(){
	var reAdd = readdGrants();
	var grantArray1 = needbasedGrants();
	var grantArray= needbasedGrants();
	//var grantArray3 = grantArray1;
	////(grantArray1);
	////(grantArray3);
	////(grantArray);
	var length = grantArray.length;
	var revisedGrants = [];
	var total = reAdd;
	//(total);
	if(reAdd === 0){
		revisedGrants = reviseGforNeed();
	}
	else{
		for(var x = 0; x < length; x++){
			if(grantArray[x].amt <  total){
				revisedGrants.push(grantArray[x])
				//(total);
				total -= grantArray[x].amt;
				//(total);
			}
			else if(grantArray[x].amt > total){
					grantArray[x].amt = total;
					//(total);
					total = 0;
					revisedGrants.push(grantArray[x]);
					//(total);
			}
		}
	};
	//(revisedGrants);
	return revisedGrants;
}


//returns new need based array
function joinRevisedNBaid(){
	//loans after adj for need & readd
	var nLoans = adjNBloans();
	//(nLoans);
	//grants after adj for need & readd
	var grants = adjNBgrants();
	var sacred = sacredAidarray()
	var newNeedarray = nLoans.concat(grants,sacred);
	//(newNeedarray);
	return newNeedarray;
}

//sums up new need based aid amts
function sumRevisedNBaid(){
	var needArray = joinRevisedNBaid();
	var length = needArray.length;
	var total = 0
	for(var i = 0; i < length; i++){
		total += needArray[i].amt;
	}
	return total;
}

//checks for cost overage after NB aid revision
function checkCost(){
	var bio = gatherBio();
	var total = sumNonNeed() + sumRevisedNBaid();
	var cost = (bio[0] - bio[3]) - total;
	//number
	//return cost;
	if(cost < 0){
		cost = cost;
	}
	//if cost > 0 - then no cost overage exists
	else{
		cost = 0;
	}
	//.log(cost);
	return cost;
}

//gather non need loans into array
function nonNeedLoans(){
	var megaArray = aidObject();
	var nonneedLoans = [];
	var length = megaArray.length;
	for(var i= 0; i < length; i++){
		if(megaArray[i].type < 5){
			nonneedLoans.push(megaArray[i]);
		}
	}
	nonneedLoans.sort(function(a,b){return a.type - b.type});
	//object array
	return nonneedLoans;
}

//if an overage exists - set all other loan amounts to = 0
function reviseLforCost(){
	//.log(525600);
	//if k is positive, no overage, if negative, overage
	var cost = checkCost();
	//array of need based loans
	var loans = nonNeedLoans();
	var length = loans.length;
	//if cost is a positive number, Cost overage does not exist
	//if cost is a negative number, Cost overage exists
	if(cost < 0){
		for(var i = 0; i<length; i++){
		loans[i].amt = 0;
		}
	};
	return loans;
	
}

//returns amount to be re-added from zeroed loans, if any
function readdCostloans(){
	var cost = checkCost();
	var need = sumNonNeed();
	//if need overage is less than nb loan amt
	//then too much was taken away
	if(cost < 0 && (Math.abs(cost)) < need){
		var readd = need - Math.abs(cost); 
	}
	else{
		var readd = 0;
	}
	//.log(123407390412);
	//.log(readd);
	return readd;	
}

//readds loans if too much was zeroed 
//this will only happen if need overage is less than total loan amt
function adjCostloans(){
	//.log("I work");
	var reAdd = readdCostloans();
	var loans = nonNeedLoans();
	var length = loans.length;
	//to make sure bot is reduced last
	var reversed = loans.reverse();
	var revisedCostloans = [];
	var total = reAdd;
	if(reAdd === 0){
		//.log('Im being triggered');
		revisedCostloans = reviseLforCost();
	}
	else{
		for(var x=0; x < length; x++){
			if(reversed[x].amt <  total){
				//.log('elseif being triggered');
				revisedCostloans.push(reversed[x])
				total -= reversed[x].amt;
			}
			else if(reversed[x].amt > total){
				//.log('else elseif being triggered');
				reversed[x].amt = total;
				total = 0;
				revisedCostloans.push(reversed[x]);
			}
		}
	};
	//.log(revisedCostloans);
	return revisedCostloans;
}

//reconvert .type values to aid strings
function unconvertType(val){
	for(var x= 0; x < val.length; x++){
		switch(val[x].type){
		
		//plus
		case 1:
		val[x].type = "PLUS";
		break;
		
		//unsub
		case 2:
		val[x].type = "Unsubsidized Loan";
		break;
		
		//cal/alt
		case 3:
		val[x].type = "Cal/Alternative Loan";
		break;
		
		//bot
		case 4:
		val[x].type = "Be On Time Loan";
		break;
		
		//perkins
		case 5:
		val[x].type = "Perkins Loan";
		break;
		
		//sub
		case 6:
		val[x].type = "Subsidized Loan";
		break;
		
		//UT grant	
		case 11:
		val[x].type = "UT Grant";
		break;
		
		//PTG
		case 10:
		val[x].type = "Partial Tuition Grant";
		break;
		
		//TPEG
		case 9:
		val[x].type = "TPEG";
		break;
		
		//tx grant
		case 7:
		val[x].type = "TEXAS Grant";
		break;
		
		//tx grant match
		case 8:
		val[x].type = "TEXAS Grant Match";
		break;
		
		//fws
		case 12:
		val[x].type = "Federal Work-Study";
		break;
		
		//pell
		case 13:
		val[x].type = "Pell Grant";
		break;
		
		//top 10
		case 14:
		val[x].type = "Top 10% Scholarship";
		break;
		
		
		//catchall for gms/terry 
		case 15:
		val[x].type = "Misc. OSFS Scholarship";
		break;
		
		
		default:
		break;
		}
	};	
	return val;
};

//concats for unconvertType switch 
function joinrevisedAid(){
	var finalArray = joinRevisedNBaid().concat(adjCostloans());
	//(finalArray);
	//sort in ascending for comparison w/original array - to allow for conditional 
	//css formatting
	var sorted = finalArray.sort(function(a,b){return a.type - b.type});
	return unconvertType(sorted); 
}




function displayupdatedAmts(array){
	var display = checkCost();
	var display1 = joinrevisedAid();
	//for comparison purposes - pulls initial array
	var display2 = aidObject().sort(function(a,b){return a.type - b.type});
	var length = display1.length;
		for(var x = 0; x < length; x++){
			if(display2[x].amt != display1[x].amt){
				$('#results').append('<div class="changedAid"> <p>' + display1[x].type + '</p><p>Amount: ' + display1[x].amt + '</p></div>').css("display","block");
			}
			else{
				$('#results').append('<div class="updated"> <p>' + display1[x].type + '</p><p>Amount: ' + display1[x].amt + '</p></div>').css("display", "block");
			};
		}	
 }
 

function clearResult(){
	document.getElementById("bio").reset();
	$('#results').empty();
}


function test(){
	var j = compareChanges();
}
