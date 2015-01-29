"use strict";

//need to filter out 342000
//need to convert any osfs scholarship award codes to simple 331
var myDom = document.getElementById('result');

//gather p6 paste information and clean it up
function newgetPaste(){
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
	//convert all OSFS scholarships to same type
	$.each(pastedArray2,function(index){
		var testVar = this.type;
			if(testVar.toString().substring(0,3)==="331" || testVar.toString().substring(0,3)==="341"){
				pastedArray2[index].type = 331000;
			}				
	})
	console.log(pastedArray2);
	return pastedArray2;	
}



//needRank determines order of reduction.  Lowest needRank gets reduced first  needBased flag will be used to gather need objects only for need redux

//will need to look for (!object.sacred) to exclude pell & etc 


function runitThrough(thingy){
	var k = [];
	$.each(thingy, function(){
			k.push(convertAid(this.type, this.value));
	})
	//filters out undefined values
	k = k.filter(function(x){
		return (x);
	})
	console.log(k);
	return k;
}

$('#onf').on("click",function(){
	var k = runitThrough(newgetPaste());
})

