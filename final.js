
function sumitUp(){
	var typeofAid = [];
	var amtofAid = [];
	var typeAmt = [];
	var nonNeed = 0;
	var need = 0;
	//pushes .amount fields to amtofAid array
	$('.aidInput').children('.amount').each(function(index){
		var k = parseInt($(this.val));
		if(typeof k ==="number"){
			amtofAid.push(parseInt($(this).val()));
		}
		else{
			amtofAid.push(NaN);
		}
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
	});
	//updates Need and Non-need amounts
	for(var x=0; x<typeAmt.length; x++){
		if(typeAmt[x].type <= 4){
			nonNeed += typeAmt[x].amt;
		}
		else{
			need += typeAmt[x].amt;
		}
	};
	return{
	need: need,
	nonNeed: nonNeed,
	typeAmt: typeAmt,
	}
};

function checkCostNeed(){
	var result = sumitUp();
	var bio = [];
	$('.bio').each(function(index){
		bio.push(parseInt(($(this).val())));
	});
	console.log(bio);
}
