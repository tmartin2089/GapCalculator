//todo: remove 342000 from array p6 osch code
//todo: reset all named scholarships to 331000
//todo: reset all gms/terry to 341000


"use strict";
//gathers award information


//gets rid of all extraneous and returns numbers only
function getPaste(){
	var pasted = $('.paste').val().replace(/_/g,' ');
	var split = pasted.split(' ');
	var pastedArray = [];
	for(var x= 0; x< split.length; x++){
		//pushes number values to array/excludes NaN values
		//generated by parseInt
		if(parseInt(split[x])){
			pastedArray.push(parseInt(split[x]));
		}
	}
	console.log(pastedArray);
	return pastedArray;
}

function removeOSCH(){
	var pastedArray = getPaste();
	

}

function separateType(){
	var getArray = getPaste();
	var type = [];
	for(var x = 0; x< getArray.length; x++){
		if(getArray[x].toString().length === 6)
			type.push(getArray[x]);
	};
	console.log(type);
	console.log(convertType(type));
	return convertType(type);
}

function separateAmt(){
	var getArray = getPaste();
	var amt = [];
	for(var x = 0; x< getArray.length; x++){
		if(getArray[x].toString().length < 6)
			amt.push(getArray[x]);
	};
	return amt;
}

function convertType(val){
	for(var x= 0; x < val.length; x++){
		switch(val[x]){
		
		//plus
		case 215025:
		case 215026:
		val[x] = 1;
		break;
		
		//unsub
		case 214125:
		case 215126:
		val[x] = 2;
		break;
		
		//cal/alt
		case 222001:
		case 241002:
		val[x] = 3;
		break;
		
		//bot
		case 223001:
		case 223002:
		case 223003:
		case 223004:
		val[x] = 4;
		break;
		
		//perkins
		case 213003:
		val[x] = 5;
		break;
		
		//sub
		case 214025:
		case 214026:
		val[x] = 6;
		break;
		
		//UT grant	
		case 131252:
		case 131253:
		case 131254:
		case 131255:
		case 131256:
		val[x] = 7;
		break;
		
		//PTG
		case 131200:
		case 131201:
		case 131202:
		val[x] = 8;
		break;
		
		//TPEG
		case 131115:
		case 131110:
		case 131116:
		case 131111:
		val[x] = 9;
		break;
		
		//tx grant match
		case 131114:
		val[x] = 10;
		break;
		
		//tx grant
		case 121176:
		case 121178:
		case 121180:
		val[x] = 11;
		break;
		
		//fws
		case 411001:
		val[x] = 12;
		break;
		
		//pell
		case 111028:
		case 111029:
		val[x] = 13;
		break;
		
		//top 10
		case 321380:
		case 321396:
		val[x] = 14;
		break;
		
		//need to add in named - convert to 331000
		case 331000:
		case 331000:
		val[x] = 15;
		break;
		
		//catchall for gms/terry - convert to 341000
		case 341000:
		val[x] = 16;
		break;
		
		
		default:
		console.log('nothing here boss');
		break;
		}
	};	
	
	console.log('convertype is now working');
	console.log(val);
	return val;
	console.log(typeof val);
};


	
	
//final step - creates mega array of aid types	
function pastedtoObject(){
	var getType = separateType();
	var getAmt = separateAmt();
	var typeAmt = [];
	for(var x = 0; x< getType.length; x++){
		typeAmt.push({type:getType[x], amt:getAmt[x]});
	}
	console.log(typeAmt);
	return typeAmt;
}



function canIcall(){
	var k = gatherBio();
	console.log(k);
}
	
//-----------------------------------------------//

//gathers bio information


 // 131252 UT Grant-UG  _1500.00
 // 131110 TPEG Residen _2500.00
 // 131200 Partial Tuit __644.00