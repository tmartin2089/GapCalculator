//final my ass

"use strict";

function gatherBio(){
	var bio = [];
	$('.bio').each(function(index){
		//NaN = false
		if(parseInt($(this).val())){
			bio.push(parseInt($(this).val()));
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
	console.log("totalaid just fired")
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
	console.log(needAid);
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
