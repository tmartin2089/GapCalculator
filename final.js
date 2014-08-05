
//captures bio elements into array [0]=coa, [1]=efc [2]=gift
//Calculates need from bio information (coa-efc-st res)
function sumBio(){
	var bio = [];
	$('.bio').each(function(index){
		if(isNaN(parseInt($(this).val()))){
				alert('Please use numbers in all fields');
			}
			else{
				bio.push(parseInt($(this).val()));
			};
	});
	var cost = bio[0];
	var stRes = bio[2];
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
	//For totaling non-need based aid
	var nonneedAid = 0;
	//For totaling need based aid
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
		typeofAid.push(parseInt($(this).val()));
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
	//updates need and non-need amounts
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
	//determines if stdt is over cost & how much
	if(costofAttend < totalAid){
		var overCost = totalAid - costofAttend;
		console.log('Student is over cost by $' + overCost);
	}
	else{
		var overCost = 0;
		console.log('Student is under cost by $' + (costofAttend - totalAid));
	};
	//determines if stdt is over need & how much
	if(needbasedAid > needEligibility){
		var overNeed = needbasedAid - needEligibility;
		console.log('Student is over need by $' + overNeed);
	}
	else{
		var overNeed = 0;
		console.log('Student is under need');
	};
	return{
	overCost: overCost,
	overNeed: overNeed,
	};
};

//no longer sure if needed - why not just exclude entitlements 
//from revision arrays?
//totals and protects entitlements
 // function sacroSanct(){
	// var result = sumitUp();
	// var typeAmt = result.typeAmt;
	// var sacredAid = 0;
	// //identifies entitlements
	// for(var x = 0; x<typeAmt.length; x++){
		// if(typeAmt[x].type >= 12){
			// sacredAid += typeAmt[x].amt;
		// };
	// };
	// return{
	// sacredAid: sacredAid,
	// };
 // };
 
 //generates loansFirst and loansAmt arrays for reviseloansNeed()
 function needloansArray(){
	var result = sumitUp();
	var typeAmt = result.typeAmt;
	var typeAmtL = typeAmt.length;
	var loansFirst = [];
	var loansAmt = 0;
	//gather need based loans first
	for(var x = 0; x<typeAmtL; x++){
		if(typeAmt[x].type === 5 || typeAmt[x].type ===6){
			loansFirst.push(typeAmt[x]);
		};
	};
	for(var k=0; k<loansFirst.length; k++){
		loansAmt += loansFirst[k].amt;
	};
	//var testTj = reviseloansNeed(overage,0,loansAmt,loansFirst);
	return{
	loansFirst: loansFirst,
	loansAmt: loansAmt,
	};
 }

function reviseloansNeed(overamt,end,needArray){
	if(overamt <= 0 || end >= needArray.length){   //base case  totalNeed is less than 
    //at end of revise - if negative then too much was taken away
	//this returns negative as positive remainder for re-adding
		if(overamt < 0){
			var remainder =(Math.abs(overamt));
			console.log(needArray);
			console.log('Student can keep $' + remainder);  //will need to re-add remainder to aid
		}
		else{
			var remainOver = overamt;
			var needArray = needArray;
			console.log('To be taken from any grants $' + overamt);
			console.log(needArray);
		};
	}	
	else{
		overamt -= needArray[end].amt;
		needArray[end].amt = 0; 
		return reviseloansNeed(overamt,end+1,needArray);
	};
	return{
	remainOver: remainOver,
	needArray: needArray,
	}
}
 

 function doEverything(){
	var overResult = checkCostNeed();
	var overage = overResult.overNeed;
	var needArray = needloansArray();
	var loansFirst = needArray.loansFirst;
	var result = reviseloansNeed(overage,0,loansFirst);
	var remainOver = result.remainOver;
	var newArray = result.needArray;
	console.log(remainOver);
	console.log(needArray);
 }

