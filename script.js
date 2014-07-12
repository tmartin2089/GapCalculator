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

function checkNeed(){
	var loanType = $('#loans').val();
	var loanAmt = $('#loanAmt').val();
	if(loanType > 4){
	console.log(loanAmt + "is need based.")
	};
	console.log(loanType);
	console.log(loanAmt);
	
};


//pell chart - convert to json - sort w/ajax req


function calculateAll(){
checkCost();
checkNeed();
};

