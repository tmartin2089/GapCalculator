
function sumitUp(){
	var nonNeed = 0;
	var need = 0;
	var typeofAid = [];
	var amtofAid = [];
	
	$('.aidInput').children('.amount').each(function(index){
		var k = parseInt($(this.val));
		if(typeof k ==="number"){
			amtofAid.push(parseInt($(this).val()));
		}
		else{
			amtofAid.push(NaN);
		}
	});
	

	console.log(amtofAid);
};
