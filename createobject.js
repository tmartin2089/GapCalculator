"use strict";

//need to filter out 342000
//need to convert any osfs scholarship award codes to simple 331
var myDom = document.getElementById('result');

//gather p6 paste information
function getPaste(){
	//clean up your input
	var pasted = $('.paste').val().replace(/_/g,' ').split(' '); //remove underscores
	var pastedArray = [];
	var pastedArray2 = [];
	//get rid of big ol' words
	$.each(pasted,function(){
		if(parseInt(this) && (parseInt(this) > 10)){ //to avoid top 10% counted as amt
			pastedArray.push(parseInt(this));
		}
	})
	//convert into prelim object array for later conversionObject
	//added as separate each statement for ease of comprehension/I really dont want to put together a longer boolean in the above
	$.each(pastedArray,function(index){
		if((index % 2) === 0){
			pastedArray2.push({type:this, value:pastedArray[index+1]});
		}
	})
	console.log(pastedArray2);
	return pastedArray2;	
}


//next up - need to umbrella convert named scholarships and filter outside scholarships


//needRank determines order of reduction.  Lowest needRank gets reduced first  needBased flag will be used to gather need objects only for need redux

//will need to look for (!object.sacred) to exclude pell & etc 


function runitThrough(thingy){
	var k = [];
	var errorarr = [];
	var j;
	//the errorarr is pointless, this needs refining 
	$.each(thingy, function(){
		if(isNaN(this.type) || (this === undefined)){
			errorarr.push(this.type, this.value);
		}
		else{
			k.push(convertAid(this.type, this.value));
		}
	})
	console.log(errorarr);
	console.log(k);
	//console.log(myObj);
	return k;
}

$('#onf').on("click",function(){
	var k = runitThrough(getPaste());
})

