//gets rid of all extraneous and returns numbers only
function getPaste(){
	var pasted = $('.paste').val().replace(/_/g,' ');
	var split = pasted.split(' ');
	var pastedArray = [];
	for(var x= 0; x< split.length; x++){
		if(parseInt(split[x])){
			pastedArray.push(parseInt(split[x]));
		}
	}
	return pastedArray;
}

function separateType(){
	var getArray = getPaste();
	var type = [];
	for(var x = 0; x< getArray.length; x++){
		if(getArray[x].toString().length === 6)
			type.push(getArray[x]);
	};
	return type;
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




// 131252 UT Grant-UG  _1500.00
// 131110 TPEG Residen _2500.00
// 131200 Partial Tuit __644.00