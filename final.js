
//captures bio elements into array [0]=coa, [1]=efc [2]=gift
//Calculates need from bio information (coa-efc-st res)
function sumBio(){
	var bio = [];
	$('.bio').each(function(index){
		if(isNaN(parseInt($(this).val()))){
				alert('Please use numbers in all fields');
			}
			else{
				bio.push(parseInt(($(this).val())));
			};
	});
	var cost = bio[0];
	var stRes = bio[2];
	console.log(cost);
	if(bio[0] - bio[1] <= 0 || (bio[0] - bio[1]) - bio[2] <= 0){
		var need = 0;
		console.log('entitlements only')
	}
	else{
		//COA - EFC - St Res Gift
		var need = (bio[0]-bio[1]) - bio[2];
	};
	return{
	cost: cost,
	stRes: stRes,
	need: need,
	};

}

//Captures amounts and types of aid in arrays
//Error handling for NaN text inputs
function sumitUp(){
	var typeofAid = [];
	var amtofAid = [];
	var typeAmt = [];
	//Total non-need based aid
	var nonneedAid = 0;
	//Total need based aid
	var needAid = 0;
	//pushes .amount values or NaN to amtofAid array 
	$('.aidInput').children('.amount').each(function(index){
		if(isNaN(parseInt($(this).val()))){
			amtofAid.push(NaN);
		}else{
			amtofAid.push(parseInt($(this).val()));
		};
	});
	//pushes .typeofAid to typeofAid array
	$('.typeofAid').each(function(index){
		typeofAid.push($(this).val());
	});
	//pushes amtofAid and typeofAid into object array
	var amtofAidlength = amtofAid.length;
	for(var i=0; i<amtofAidlength; i++){
		typeAmt.push({type:typeofAid[i], amt: amtofAid[i]
		});
	};
	//filters out NaN values
	typeAmt = typeAmt.filter(function(loan){
		return !isNaN(loan.amt);
		return typeAmt;
	});
	console.log(typeAmt);
	//updates Need and Non-need amounts
	for(var x=0; x<typeAmt.length; x++){
		if(typeAmt[x].type <= 4){
			nonneedAid += typeAmt[x].amt;
		}
		else{
			needAid += typeAmt[x].amt;
		}
	};
	return{
	needAid: needAid,
	nonneedAid: nonneedAid,
	typeAmt: typeAmt,
	}
};

//takes above summations and calculates eligibility
function checkCostNeed(){
	var bioResult = sumBio();
	var result = sumitUp();
	var needbasedAid = result.needAid;
	var costofAttend = bioResult.cost;
	var needEligibility = bioResult.need;
	//sums up P6 aid and St Res Gift
	var totalAid = (needbasedAid  + result.nonneedAid) + bioResult.stRes;
	console.log(needbasedAid + result.nonneedAid);
	console.log('Total aid and resources is ' + totalAid);
	//determines if stdt is over cost & how much
	if(costofAttend < totalAid){
		var overCost = totalAid - costofAttend;
		console.log('Student is over cost by $' + overCost);
	}
	else{
		console.log('Student is under cost by $' + (costofAttend - totalAid));
	};
	//determines if stdt is over need & how much
	if(needbasedAid > needEligibility){
		var overNeed = needbasedAid - needEligibility;
		console.log('Student is over need by $' + overNeed);
	}
	else{
		console.log('Student is under need by $' + (needEligibility - needbasedAid));
	};
	return{
	overCost: overCost,
	overNeed: overNeed,
	};
};

//totals and protects entitlements
 function sacroSanct(){
	var result = sumitUp();
	var typeAmt = result.typeAmt;
	var sacredAid = 0;
	//identifies entitlements
	for(var x = 0; x<typeAmt.length; x++){
		if(typeAmt[x].type >= 12){
			sacredAid += typeAmt[x].amt;
		};
	};
	console.log(sacredAid);
	return{
	sacredAid: sacredAid,
	};
 };
 
 function revisions(){
	var result = sumitUp();
	var overResult = checkCostNeed();
	var typeAmt = result.typeAmt;
	var overage = overResult.overNeed;
	var sacred = sacroSanct();
	var sacredAid = sacred.sacredAid;
	console.log('inside revision need overage is ' + overage);
	//revise for need from loans first
	for(var x = 0; x<typeAmt.length; x++){
		if(typeAmt[x].type >= 5 && typeAmt[x].type <=6 && overage > 0){
			overage -= typeAmt[x].amt;
			console.log(typeAmt[x].type);
		};
	};
	console.log('overage after changes' + overage);
 }


 function doEverything(){
	checkCostNeed();
	sacroSanct();
	revisions();
 }

