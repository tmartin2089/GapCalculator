
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
	//sums up P6 aid and St Res Gift
	var totalAid = (result.needAid  + result.nonneedAid) + bioResult.stRes;
	console.log(result.needAid + result.nonneedAid);
	console.log('Total aid and resources is ' + totalAid);
	//determines if stdt is over cost & how much
	if(bioResult.cost < totalAid){
		var overCost = totalAid - bioResult.cost;
		console.log('Student is over cost by $' + overCost);
	};
	function checkNeed(){
		//skip unnecessary for loop
		var need = (bio[0]-bio[1]) - bio[2];
		var overNeed = result.need - need;
		//console.log('Total need is $' + need);
		//console.log('Total need based aid is $' + result.needAid);
		if(result.need > need){
			console.log('Student is $' + overNeed + ' over need');
			return overNeed;
		}
		else{
			console.log('im still working');
		};
		return{
		overNeed: overNeed,
		}
	};
	var tjtest = checkNeed();
	//console.log(tjtest.overNeed);
};

//totals entitlements for protection
 function sacroSanct(){
	var result = sumitUp();
	var typeAmt = result.typeAmt;
	var needAid = result.needAid;
	var sacredAid = 0;
	for(var x = 0; x<typeAmt.length; x++){
		if(typeAmt[x].type >= 12){
			sacredAid += typeAmt[x].amt;
		};
	};
	if(needAid > sacredAid){
		needAid -= sacredAid;
		console.log(needAid + ' may be reduced after protecting entitlements');
	}
//console.log(sacredAid);
 }


 function doEverything(){
	checkCostNeed();
	sacroSanct();
 }

