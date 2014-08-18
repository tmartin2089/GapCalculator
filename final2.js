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
			amtofAid.push(NaN);
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
		return !isNaN(loan.amt);
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
		if(megaArray1[i].type > 4){
			needAid += megaArray1[i].amt;
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

//returns cost overage
function checkCost(){
	var bio = gatherBio();
	var total = totalAid();
	var cost = bio[0] - total;
	//number
	return cost;
	//in future function - if cost is negative, then over cost
}

//subtracts total need based aid from Fed Need  - returns if overawarded
function checkNeed(){
	var need = (determineNeed() - sumNeed());
	//number
	console.log('overage is ' + need);
	return need;
	//in future function - if need is negative, then over need
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

//sums up total need based loans
function nbloanamt(){
	var needLoans = needbasedLoans();
	var needLoansAmt = 0;
	var length = needLoans.length;
	for(var i= 0; i < length; i++){
		needLoansAmt += needLoans[i].amt;
	}
	return needLoansAmt;
}

//duh - they're all need based, but want consistent name for a similar function
function needbasedGrants(){
	console.log('im working!');
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


//if an overage exists - set all NB loan amounts to = 0
function reviseLforNeed(){
	var k = checkNeed();
	var j = needbasedLoans();
	var l = k;
	console.log(l);
	console.log(typeof l);
	var length = j.length;
	//if checkNeed/k is a positive number, need overage does not exist
	//if overage exists
	if(k >= 0){
		console.log('within need!');
	}
	else{
		for(var i = 0; i<length; i++){
			j[i].amt = 0;
		}
	};
	return j;
}

//determines if too much was taken away
function findloanOverage(){
	var k = nbloanamt();
	console.log('findloanOverage ' + k);
	var j = checkNeed();
	console.log('findloanOverage checkNeed ' + j);
	//checkNeed returns a negative number if too much taken away
	if(j < 0){
		var kj = (Math.abs(j)) - k;
	};
	console.log(kj);
	//this is the amount that needs to be re-added
	return kj;
}


//if findloanOverage returns positive number, no aid needs to be re-added
function readdLoans(){
	
	
	//will need to determine new need amounts
}

//return array with adjusted amounts



function test(){
	var k = reviseLforNeed();
	console.log(k);
	var l = findloanOverage();
	//this is just here to make sure earlier problem doesn't reoccur
	var j = megaArray();
	console.log(j);
}
