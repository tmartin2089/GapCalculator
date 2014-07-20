//set temporary global variables until you can bake
//input fields into index

var efc = $('#efc').val();


function checkCost(){                      
//these two will eventually be value captures from index
	var coa = $('#coa').val();
	console.log(coa);
	var totalAid = 500;
	if(coa - totalAid < 0){
		var overage = totalAid-coa;
		console.log("you are $" + overage + " over cost");
	}
	else{
		console.log("Within cost!");
	}
//need to check totalCost - totalAid 
};

//this captures select values in arrays above
function sumitUp(){
	var nonNeed = 0;
	var need = 0;
	var typeofLoan = [];
	var typeofGift = [];
	var amtofAid =[];
	var selectArray = []
	//this captures values of aidInput into above arrays
	//can do away with this error handling if we make new inputs display only if
	//previous one is filled out
	$(".aidInput").children('.amount').each(function(index) {
		if($(this).val() != ''){
			amtofAid.push(parseInt($(this).val()));
		};
	});
	$(".loanType").each(function(index) { 
		typeofLoan.push($(this).val()); 
	});
	console.log(typeofLoan);
	$(".giftType").each(function(index) {
		typeofGift.push($(this).val());
	});
	var joinedType = typeofLoan.concat(typeofGift);
	//habit - capture .length in a variable so jscript doesn't have to recount every iteration
	var joinedTlength = joinedType.length;
	for(i=0; i<joinedTlength; i++){
		if(joinedType[i]<=4){
		nonNeed += parseInt(amtofAid[i]);
		}
		else{
		need += parseInt(amtofAid[i]);	
		}
	};
	return {
	need: need,
	nonNeed: nonNeed,
	}
};


//two competing arrays.  one captures values, the other
//captures amts  so if valueArray[1]>=4, then 
//amtArray[1]=need based

//this totals loans - now need to total by need and non-need
function totalLoans(){
 var arr = $('[name="loanAmt"]');
 var total=0;
 var arrLength = arr.length; 
	for(var i=0; i<arr.length; i++){
	if(parseInt(arr[i].value))
		total+= parseInt(arr[i].value);
	}
	return total;
};

//going to need separate total for need/cost calcs

//maybe if value > 3 need += needArray[i]?

// function checkNeed(){
	// var loanType = $('.loans').val();
	// var loanAmt = $('#loanAmt').val();
	
	// var total = 0;
	// if(loanType > 4){
	// console.log(loanAmt + "is need based.")
	// };
	// console.log(loanType);
	// console.log(loanAmt);
	
// };


//pell chart - convert to json - sort w/ajax req


function calculateAll(){    //allows me to call multiple variables
	var result = sumitUp();  // bc they are object literal
	console.log('need is ' + result.need);
	console.log('non need is' + result.nonNeed);
};
