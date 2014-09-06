"use strict";

//need to filter out $ and other non-numeric values
//need to dynamically add form elements - see http://www.randomsnippets.com/2008/02/21/how-to-dynamically-add-form-elements-via-javascript/

//gathers #bio values in array




function gatherBio(){
	var bio = [];
	$('.bio').each(function(index){
		if(parseInt($(this).val())){
			bio.push(parseInt($(this).val()));
		}
	});
	console.log(bio);
	return bio;
}

//Determines need ((COA - EFC) - ST RES GIFT = need)
function determineNeed(){
	var bio = gatherBio();
	if(bio[0] - bio[1] <= 0 || (bio[0] - bio[1]) - bio[2] <= 0){
	var need = 0;
	}
	else{
	//COA - EFC - St Res Gift
	var need = (bio[0]-bio[1]) - bio[2];
	};
	//console.log('calculated need is ' + need);
	return need;
}

//gathers amounts from text input fields with class .amount
function gatherAidamt(){
	var amtofAid = [];
	$('.aidInput').children('.amount').each(function(index){
		if(isNaN(parseInt($(this).val()))){
			//must push a NaN value if blank or other, so can later be filtered against typeofAid
			amtofAid.push(0);
		}else{
			amtofAid.push(parseInt($(this).val()));
		};
	});
	return amtofAid;
}

//gathers values from .typeofAid select form options
function gatherAidtype(){
	var typeofAid = [];
	$('.typeofAid').each(function(index){
		typeofAid.push(parseInt($(this).val()));
	});
	return typeofAid;
}

//aggregates gatherAidtype and gatherAidamt arrays into ultra mega super object array
//why?  because you will need access to type and amount of aid later
function megaArray(){
	var amount = gatherAidamt();
	var type = gatherAidtype();
	var typeAmt = [];
	var length = amount.length;
	for(var i = 0; i<length; i++){
		typeAmt.push({amt:amount[i], type:type[i]});
	}
	typeAmt = typeAmt.filter(function(loan){
	 return loan.amt > 0;
	 })
	return typeAmt;
}

//sums up all aid + st res gift for cost purposes
function totalAid(){
	var bio = gatherBio();
	var total = sumNeed() + sumNonNeed() + bio[2];
	//number
	return total;
}

//sums total amount of need based aid from megaArray function
function sumNeed(){
	//cant reuse megaArray variable name as it's already a global function
	//knowledge is power!
	var megaArray1 = megaArray();
	var length = megaArray1.length;
	var needAid = 0;
	for(var i = 0; i<length; i++){
		if(megaArray1[i].type > 4 && megaArray1[i].amt != 0){
			needAid += megaArray1[i].amt;
		}
		else{
			needAid += 0;
		}
	};
	//console.log('calculated need based aid is ' + needAid);
	//number
	return needAid;
}

//sums up total amount of non-need based aid from megaArray function
function sumNonNeed(){
	var megaArray1 = megaArray();
	var length = megaArray1.length;
	var nonNeedAid = 0;
	for(var i = 0; i < length; i++){
		if(megaArray1[i].type <= 4){
			nonNeedAid += megaArray1[i].amt;
		}
	};
	//number
	return nonNeedAid;
}


//subtracts total need based aid from Fed Need  - returns if overawarded
function checkNeed(){
	var need = (determineNeed() - sumNeed());
	//number
	//console.log('overage is ' + need);
	return need;
	//if need is negative, then over need
	//if need is positive, then under need
}

//separate need based loans into array for need revisions (loans first)
function needbasedLoans(){
	var callArray = megaArray();
	var needLoans = [];
	var length = callArray.length;
	for(var i= 0; i < length; i++){
		if(callArray[i].type === 5 || callArray[i].type === 6){
			needLoans.push(callArray[i]);
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
	//if k is positive, no overage, if negative, overage
	var k = checkNeed();
	//array of need based loans
	var j = needbasedLoans();
	var l = k;
	var length = j.length;
	//if checkNeed/k is a positive number, need overage does not exist
	//if checkNeed/k is a negative number, need overage exists
	if(k >= 0){
		//console.log('within need!');
	}
	//overage exists  - set amts to 0
	else{
		for(var i = 0; i<length; i++){
			j[i].amt = 0;
		}
	};
	return j;
}


//checks to determine if too much was taken away
function readdLoans(){
	var j = checkNeed();
	var k = nbloanamt();
	//console.log(Math.abs(j));
	//if need overage is less than nb loan amt
	//then too much was taken away
	if(j <= 0 && (Math.abs(j)) < k){
		var readd = k - Math.abs(j); 
	}
	else{
		var readd = 0;
	}
	//console.log('to be readded ' + readd);
	return readd;	
}

//readds need based loans if too much was zeroed 
//this will only happen if need overage is less than total loan amt
function adjNBloans(){
	var j = readdLoans();
	var k = needbasedLoans();
	var reversed = k.reverse();
	var revisedNeedloans = [];
	var total = j;
	if(j === 0){
		console.log('nothing to be added, move on to checking cost');
		revisedNeedloans = reviseLforNeed();
	}
	else{
		for(var x=0; x < k.length; x++){
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
	//console.log(revisedNeedloans);
	return revisedNeedloans;
}



//will take above adjNBloans array and total new amt of nb aid 
function retotalNeed(){
	var totalNBamt = 0;
	var j = adjNBloans();
	//recalls total need amt from start of function
	var k = sumNeed();
	//recalls total need b loan amt from start of function
	var l = nbloanamt()
	var newNeed;
	//sums up revised need amts
	for(var x = 0; x < j.length; x++){
		totalNBamt += j[x].amt;
	}
	var newNeed = (k - l) + totalNBamt;
	//console.log(newNeed);
	//returns new amt of need based aid
	return newNeed;
}

//takes adjusted need amt and determines if there is an overage 
function recheckNeed(){
	var k = determineNeed() - retotalNeed();
	//console.log('grant overage is ' + k);
	return k;
	//if k is negative, then over need
	//if k is positive, then under need
}


//duh - they're all need based, but want consistent name for a similar function
//this puts adjustable aid (non-entitlements) into array for redux for need
function needbasedGrants(){
	var callArray = megaArray();
	var needGrants = [];
	var length = callArray.length;
	for(var i= 0; i < length; i++){
		if(callArray[i].type >= 7 && callArray[i].type <= 12){
			needGrants.push(callArray[i]);
		}
	}
	//sort in order of preferred reductions
	needGrants.sort(function(a,b){return a.type - b.type});
	//object array
	//console.log(needGrants);
	return needGrants;
}

//gathers all grants including entitlements
function ALLneedbasedGrants(){
	var callArray = megaArray();
	var needGrants = [];
	var length = callArray.length;
	for(var i= 0; i < length; i++){
		if(callArray[i].type > 6)
		needGrants.push(callArray[i]);
	}
	//sort in order of preferred reductions
	needGrants.sort(function(a,b){return a.type - b.type});
	//object array
	return needGrants;
}

//totals all grants
function nbgrantamt(){
	var needGrants = ALLneedbasedGrants();
	var needGrantsAmt = 0;
	var length = needGrants.length;
	for(var i= 0; i < length; i++){
		needGrantsAmt += needGrants[i].amt;
	}
	return needGrantsAmt;
}

//determines amt of entitlement aid
function sacredAid(){
	var k = ALLneedbasedGrants();
	var length = k.length;
	var sacrosanct = 0;
	for(var i= 0; i < length; i++){
		if(k[i].type >= 13){
			sacrosanct += k[i].amt;
		}
	}
	return sacrosanct;
}

function sacredAidarray(){
	var k = ALLneedbasedGrants();
	var length = k.length;
	var holyAid = [];
	for(var i= 0; i < length; i++){
		if(k[i].type >= 13){
			holyAid.push(k[i]);
		}	
	}
	return holyAid;
}

//if an overage exists - set all NB grant amounts to = 0
function reviseGforNeed(){
	//if k is positive, no overage, if negative, overage
	var k = recheckNeed();
	//array of need based loans
	var j = needbasedGrants();
	var l = k;
	var length = j.length;
	//if checkNeed/k is a positive number, need overage does not exist
	//if checkNeed/k is a negative number, need overage exists
	if(k >= 0){
		//console.log('within need!');
	}
	//overage exists  - set amts to 0
	else{
		for(var i = 0; i<length; i++){
			j[i].amt = 0;
		}
	//then check to see if too much was taken away
	};
	return j;
}



function readdGrants(){
	var j = recheckNeed();
	var k = nbgrantamt()-sacredAid();
	console.log(Math.abs(j));
	//if need overage is less than nb grant amt
	//then too much was taken away
	if(j < 0 && (Math.abs(j)) < k){
		var readd = k - Math.abs(j); 
	}
	else{
		var readd = 0;
	}
	//console.log('to be readded ' + readd);
	return readd;	
}

//readds grants if too much was zeroed out
//this will only happen if need overage is less than total loan amt
function adjNBgrants(){
	var j = readdGrants();
	var k = needbasedGrants();
	var revisedGrants = [];
	var total = j;
	if(j === 0){
		//console.log('nothing to be added, move on to checking cost');
		revisedGrants = reviseGforNeed();
	}
	else{
		for(var x=0; x < k.length; x++){
			if(k[x].amt <  total){
				revisedGrants.push(k[x])
				total -= k[x].amt;
			}
			else if(k[x].amt > total){
					k[x].amt = total;
					total = 0;
					revisedGrants.push(k[x]);
			}
		}
	};
	//console.log(revisedGrants);
	return revisedGrants;
}

//returns new need based array
function joinRevisedNBaid(){
	//loans after adj for need & readd
	var j = adjNBloans();
	//grants after adj for need & readd
	var k = adjNBgrants();
	var l = sacredAidarray()
	var newNeedarray = j.concat(k,l);
	return newNeedarray;
}

//sums up new need based aid amts
function sumRevisedNBaid(){
	var j = joinRevisedNBaid();
	var total = 0
	for(var i = 0; i < j.length; i++){
		total += j[i].amt;
	}
	//console.log(total);
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
	console.log('you are over/under by ' + cost);
	return cost;
	//in future function - if cost is negative, then over cost
}

//gather non need loans into array
function nonNeedLoans(){
	var callArray = megaArray();
	var nonneedLoans = [];
	var length = callArray.length;
	for(var i= 0; i < length; i++){
		if(callArray[i].type < 5){
			nonneedLoans.push(callArray[i]);
		}
	}
	//sort so perkins can be reduced before sub
	nonneedLoans.sort(function(a,b){return a.type - b.type});
	//object array
	console.log(nonneedLoans);
	return nonneedLoans;
}

//if an overage exists - set all other loan amounts to = 0
function reviseLforCost(){
	//if k is positive, no overage, if negative, overage
	var k = checkCost();
	//array of need based loans
	var j = nonNeedLoans();
	var length = j.length;
	//if checkCost/k is a positive number, Cost overage does not exist
	//if checkCost/k is a negative number, Cost overage exists
	if(k >= 0){
		console.log('within cost!');
	}
	//else an overage exists  - set amts to 0
	else{
		for(var i = 0; i<length; i++){
			j[i].amt = 0;
		}
	};
	console.log(j);
	return j;
}

//returns amount to be re-added from zeroed loans, if any
function readdCostloans(){
	var j = checkCost();
	var k = sumNonNeed();
	console.log(Math.abs(j));
	//if need overage is less than nb loan amt
	//then too much was taken away
	if(j <= 0 && (Math.abs(j)) < k){
		var readd = k - Math.abs(j); 
	}
	else{
		var readd = 0;
	}
	console.log('to be readded for cost ' + readd);
	return readd;	
}

//readds need based loans if too much was zeroed 
//this will only happen if need overage is less than total loan amt
function adjCostloans(){
	var j = readdCostloans();
	var k = nonNeedLoans();
	//to make sure bot is reduced last
	var reversed = k.reverse();
	var revisedCostloans = [];
	var total = j;
	if(j === 0){
		console.log('nothing to be added, move on to checking cost');
		revisedCostloans = reviseLforCost();
	}
	else{
		for(var x=0; x < k.length; x++){
			if(reversed[x].amt <  total){
				revisedCostloans.push(reversed[x])
				total -= reversed[x].amt;
			}
			else if(reversed[x].amt > total){
					reversed[x].amt = total;
					total = 0;
					revisedCostloans.push(reversed[x]);
			}
		}
	};
	console.log(revisedCostloans);
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




function test(){
	var k = adjCostloans();
	console.log(k);
	var j = displayupdatedAmts();
	//this is just here to make sure earlier problem doesn't reoccur
	//var j = megaArray();
	//console.log(j);
}


