//final my

"use strict";

function gatherBio(){
	var bio = [];
	$('.bio').each(function(index){
		//NaN = false
		if(parseInt($(this).val())){
			bio.push(parseInt($(this).val()));
		}
		else{
			bio.push(0);
		}
	});
	return bio;
}


function determineNeed(){
	var bio = gatherBio();
	var cost = bio[0];
	var efc = bio[1];
	var stRes = bio[2];
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
	 var amt = 0;
	 for(var x = 0; x < megaArray.length; x++){
		amt += megaArray[x].amt;
	 }
	 return amt;
}

//totals all aid and resources
function totalAid(){
	//.log("totalaid just fired")
	var bio = gatherBio();
	var aid = gatherAmt() + bio[2];
	//number
	return aid;
}

function sumNeed(){
	//cant reuse megaArray variable name as it's already a global function
	//knowledge is power!
	var megaArray = aidObject();
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
	//.log(needAid);
	//number
	return needAid;
}


//anything remaining after taking away need from total aid must be nonneed
function sumNonNeed(){
	return gatherAmt() - sumNeed();
}


//subtracts total need based aid from Fed Need  
function checkNeed(){
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
		if(megaArray[i].type === 5 || megaArray[i].type === 6){
			needLoans.push(megaArray[i]);
		}
	}
	//sort so perkins can be reduced before sub
	needLoans.sort(function(a,b){return a.type - b.type});
	//object array
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
	return needLoansAmt;
}

//if an overage exists - set all NB loan amounts to = 0
function reviseLforNeed(){
	//if need is positive, no overage, if negative, overage bc subtracting
	//total nb aid from need
	var need = checkNeed();
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
	//.log(needLoans);
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
	////.log('to be readded ' + readd);
	return readd;	
}

//readds need based loans if too much was zeroed 
//this will only happen if need overage is less than total loan amt
function adjNBloans(){
	var readd = readdLoans();
	var needLoans = needbasedLoans();
	var length = needLoans.length;
	var reversed = needLoans.reverse();
	var revisedNeedloans = [];
	var total = readd;
	if(readd === 0){
		revisedNeedloans = reviseLforNeed();
	}
	else{
		for(var x=0; x < length; x++){
			if(reversed[x].amt <  total){
				revisedNeedloans.push(reversed[x])
				total -= reversed[x].amt;
			}
			else if(reversed[x].amt > total){
					reversed[x].amt = total;
					total = 0;
					revisedNeedloans.push(reversed[x]);
			}
		}
	};
	//.log(revisedNeedloans);
	return revisedNeedloans;
}

//will take above adjNBloans array and total new amt of nb aid 
function retotalNeed(){
	var totalNBamt = 0;
	var adjusted = adjNBloans();
	var length = adjusted.length;
	//recalls total need amt from start of function
	var need = sumNeed();
	//recalls total need b loan amt from start of function
	var amount = nbloanamt()
	var newNeed;
	//sums up revised need amts
	for(var x = 0; x < length; x++){
		totalNBamt += adjusted[x].amt;
	}
	var newNeed = (need - amount) + totalNBamt;
	////.log(newNeed);
	//returns new amt of need based aid
	return newNeed;
}

//takes adjusted need amt and determines if there is an overage 
function recheckNeed(){
	var need = determineNeed() - retotalNeed();
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
		if(megaArray[i].type >= 7 && megaArray[i].type <= 12){
			needGrants.push(megaArray[i]);
		}
	}
	//sort in order of preferred reductions
	needGrants.sort(function(a,b){return a.type - b.type});
	//object array
	////.log(needGrants);
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
function reviseGforNeed(){
	//if need is positive, no overage, if negative, overage
	var need = recheckNeed();
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
	var grantArray = needbasedGrants();
	var length = grantArray.length;
	var revisedGrants = [];
	var total = reAdd;
	if(reAdd === 0){
		revisedGrants = reviseGforNeed();
	}
	else{
		for(var x = 0; x < length; x++){
			if(grantArray[x].amt <  total){
				revisedGrants.push(grantArray[x])
				total -= grantArray[x].amt;
			}
			else if(grantArray[x].amt > total){
					grantArray[x].amt = total;
					total = 0;
					revisedGrants.push(grantArray[x]);
			}
		}
	};
	return revisedGrants;
}


//returns new need based array
function joinRevisedNBaid(){
	//loans after adj for need & readd
	var nLoans = adjNBloans();
	//grants after adj for need & readd
	var grants = adjNBgrants();
	var sacred = sacredAidarray()
	var newNeedarray = nLoans.concat(grants,sacred);
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
	var cost = (bio[0] - bio[2]) - total;
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


function displayupdatedAmts(){
	var display = checkCost();
	var display2 = joinRevisedNBaid();
	var display3 = adjCostloans();
	var length = display2.length;
	for(var x = 0; x < length; x++){
		$('#display' + display2[x].type).append('<p>Reduce to: ' + display2[x].amt + '</p>').css("display", "block");
	};
	for(var y = 0; y < display3.length; y++){
		$('#display' + display3[y].type).append('<p>Reduce to: ' + display3[y].amt + '</p>').css("display", "block");
	};
	$('#cost').append('<p>Must reduce for cost: $' + Math.abs(display) + '</p>').css("display", "block");
	//$('#display2').append('<p> Cost overage is ' + display2[0].type + '</p>');
}

function clearResult(){
	$('.result').empty();
}

function test(){

	var j = displayupdatedAmts();
	//this is just here to make sure earlier problem doesn't reoccur
	//var j = megaArray();
	////.log(j);
}
