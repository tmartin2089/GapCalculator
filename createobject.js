"use strict";
//does switching the branch in git let me save updates there?

var myDom = document.getElementById('result');

function getPaste(){
	//clean up your input
	var pasted = $('.paste').val().replace(/_/g,' ').split(' '); //remove underscores
	var pastedArray = [];
	//get rid of big ol' words
	$.each(pasted,function(){
		if(parseInt(this) && (parseInt(this) > 10)){
			pastedArray.push(parseInt(this));
		}
	})
	console.log(pastedArray);
	return pastedArray;	
}


function doStuff(){
	var k = getPaste();
	var typeAmt = [];
	$.each(k,function(index){
		if((index % 2) === 0){
			typeAmt.push({type:this, value:k[index+1]});
		}
	})
	console.log(typeAmt);
	return typeAmt;
}


//next up - need to umbrella convert named scholarships and filter outside scholarships


//needRank determines order of reduction.  Lowest needRank gets reduced first  needBased flag will be used to gather need objects only for need redux

//will need to look for (!object.sacred) to exclude pell & etc 


function runitThrough(thingy){
	var k = [];
	var errorarr = [];
	var j; 
	$.each(thingy, function(){
		if(isNaN(this.type)){
			errorarr.push(this.type, this.value);
		}
		else{
			k.push(convertAid(this.type, this.value));
		}
	})
	console.log(k);
	//console.log(myObj);
	return k;
}

$('#onf').on("click",function(){
	var k = runitThrough(doStuff());
})

