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

//this captures select values in array

function sumitUp(){
	var nonNeed = 0;
	var need = 0;
	var typeofAid =[];
	var amtofAid =[];
		$(".loans").each(function(index) { 
			typeofAid.push($(this).val()); 
		});
		$('.amount').each(function(index) {
			amtofAid.push($(this).val());
		});
		var typeLength = typeofAid.length;
		var amtLength = amtofAid.length;
		for(i=0; i<typeLength; i++){
			var need = 0;
			if(typeofAid[i]<=4){
			console.log('itsa not need based');	
			nonNeed += parseInt(amtofAid[i]);
			}
			else{
			console.log('itsa need based');	
			//need += amtofAid[i];	
			};
		}
		console.log(nonNeed);	

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


function calculateAll(){
var y = totalLoans();  //allows me to capture total value from totalLoans
console.log(y);
// checkNeed();
};

