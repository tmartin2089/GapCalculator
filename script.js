//set temporary global variables until you can bake
//input fields into index


var efc = 4500;
var cost = 12000;


function checkCost(){                      
//these two will eventually be value captures from index
	var totalAid = 11000;
	if(cost - totalAid < 0){
		var overage = totalAid-cost;
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
	
}\


//pell chart - convert to json - sort w/ajax req


function calculateAll(){
checkCost();
checkNeed();
};

