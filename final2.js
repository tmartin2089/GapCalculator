//now need to determine if  too much was taken away
//and if so, readd back to sub first, then perkins
//then you have completed revising loans for need

//gathers #bio values in array
function gatherBio(){
	var bio = [];
	$('.bio').each(function(index){
		if(isNaN(parseInt($(this).val()))){
			alert('Please use only numbers');
		}
		else{
			bio.push(parseInt($(this).val()))
		};
	});
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
	console.log('calculated need is ' + need);
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
	console.log(typeAmt);
	return typeAmt;
}

function testme(){
	var k = megaArray();
	return k;
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
	console.log(megaArray1);
	console.log(typeof megaArray1);
	var length = megaArray1.length;
	var needAid = 0;
	for(var i = 0; i<length; i++){
		if(megaArray1[i].type > 4 && megaArray1[i].amt != 0){
			console.log(megaArray1[i].type);
			console.log(typeof megaArray1[i].amt);
			needAid += megaArray1[i].amt;
		}
		else{
			needAid += 0;
		}
	};
	console.log('calculated need based aid is ' + needAid);
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
	console.log('overage is ' + need);
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
		console.log('within need!');
	}
	//overage exists  - set amts to 0
	else{
		for(var i = 0; i<length; i++){
			j[i].amt = 0;
		}
	//then check to see if too much was taken away
	readdLoans();
	};
	return j;
}



function readdLoans(){
	var j = checkNeed();
	var k = nbloanamt();
	console.log(Math.abs(j));
	//if need overage is less than nb loan amt
	//then too much was taken away
	if(j <= 0 && (Math.abs(j)) < k){
		var readd = k - Math.abs(j); 
	}
	else{
		var readd = 0;
	}
	console.log('to be readded ' + readd);
	return readd;	
}

//readds need based loans if too much was zeroed outerHeight
//this will only happen if need overage is less than total loan amt
function adjNBloans(){
	var j = readdLoans();
	var k = needbasedLoans();
	var revisedNeedloans = [];
	var total = j;
	if(j === 0){
		console.log('nothing to be added, move on to checking cost');
		revisedNeedloans = reviseLforNeed();
	}
	else{
		for(var x=0; x < k.length; x++){
			if(k[x].amt <  total){
				revisedNeedloans.push(k[x])
				total -= k[x].amt;
				console.log(total);
			}
			else if(k[x].amt > total){
					k[x].amt = total;
					total = 0;
					revisedNeedloans.push(k[x]);
			}
		}
	};
	console.log(revisedNeedloans);
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
	console.log(newNeed);
	//returns new amt of need based aid
	return newNeed;
}

//takes adjusted need amt and determines if there is an overage 
function recheckNeed(){
	var k = determineNeed() - retotalNeed();
	console.log('grant overage is ' + k);
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
		if(callArray[i].type >= 7 && callArray[i].type <= 11){
			needGrants.push(callArray[i]);
		}
	}
	//sort in order of preferred reductions
	needGrants.sort(function(a,b){return a.type - b.type});
	//object array
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
	console.log(needGrantsAmt);
	return needGrantsAmt;
}

//determines amt of entitlement aid
function sacredAid(){
	var k = ALLneedbasedGrants();
	var length = k.length;
	var sacrosanct = 0;
	for(var i= 0; i < length; i++){
		if(k[i].type >= 12){
			sacrosanct += k[i].amt;
		}
	}
	console.log('sacrosant is ' + sacrosanct);
	console.log(typeof sacrosanct);
	return sacrosanct;
}

function sacredAidarray(){
	var k = ALLneedbasedGrants();
	var length = k.length;
	var holyAid = [];
	for(var i= 0; i < length; i++){
		if(k[i].type >= 12){
			holyAid.push(k[i]);
		}	
	}
	console.log(holyAid);
	console.log(typeof holyAid);
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
		console.log('within need!');
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
	console.log('to be readded ' + readd);
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
		console.log('nothing to be added, move on to checking cost');
		revisedGrants = reviseGforNeed();
	}
	else{
		for(var x=0; x < k.length; x++){
			if(k[x].amt <  total){
				revisedGrants.push(k[x])
				total -= k[x].amt;
				console.log(total);
			}
			else if(k[x].amt > total){
					k[x].amt = total;
					total = 0;
					revisedGrants.push(k[x]);
			}
		}
	};
	console.log(revisedGrants);
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
	console.log(total);
	return total;
}


//returns cost overage
function checkCost(){
	var bio = gatherBio();
	var total = sumNonNeed() + sumRevisedNBaid();
	var cost = (bio[0] - bio[1]) - total;
	//number
	//return cost;
	console.log('you are over/under by ' + cost);
	return cost;
	//in future function - if cost is negative, then over cost
}



function test(){
	var k = joinRevisedNBaid();
	console.log(k);
	//this is just here to make sure earlier problem doesn't reoccur
	var j = megaArray();
	console.log(j);
}


