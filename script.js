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

//this totals loans - now need to total by need and non-need
function totalLoans(){
 var arr = document.getElementsByName('loanAmt');
 var total=0;
 var arrLength = arr.length;
	for(var i=0; i<arr.length; i++){
	if(parseInt(arr[i].value))
		total+= parseInt(arr[i].value);
	}
	console.log(total);
};

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
checkCost();
// checkNeed();
};

