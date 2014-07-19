
$(document).ready(addLinks());


function addLinks () {
    for (var i=0, link; i<5; i++) { 
	//when function addLinks is called, the loop 
	//terminates at 5 - this is what onclick function()alert(i)
	//would see
        link = document.createElement("a");
        link.innerHTML = "Link " + i;
		//on each iteration of the loop, local variable num 
		//will be set to current value of i 
        link.onclick = function(num) {
			return function(){
            alert(num);
			};
        }(i);
        document.body.appendChild(link);
    }
}

// function addLinks () {
    // for (var i=0, link; i<5; i++) {
        // link = document.createElement("a");
        // link.innerHTML = "Link " + i;
        // link.onclick = function (num) {
            // return function () {
                // console.log(num);
            // };
        // }(i);
		
		// //the above evalutes to link.onclick(i), but it's saving
		// //each instantiation 
		
		// //for each iteration step the outer function literal 
		// //will evaluate to a new function object with its own 
		// //scope and local variable num, whose value is set to 
		// //the current value of i. As num is never modified, 
		// //it will stay constant over the lifetime of the 
		// //closure: The next iteration step doesn't overwrite 
		// //the old value as the function objects are independent.
        // document.body.appendChild(link);
    // }
// }

//time to build autofill button

//fills amt field for testing purposes
function autofill(){
	var amtArray = [];
	for(i=0; i<8; i++){
		var randomnumber = Math.floor((Math.random() * 8000)+1);
		amtArray[i] = randomnumber;
		var elem = $('.amount')[i];  //returns DOM object unlike just $('#loanAmt1')
		elem.value = amtArray[i];       //which would be a jquery object
	};
	console.log(amtArray);
};



function autofillSelectLoans(){
	var selectloansArray = [];
	for(i=0; i<4; i++){
		var randomnumber1 = Math.floor((Math.random() * 6)+1);
		selectloansArray[i] = randomnumber1;
		var elem1 = $('.loanType')[i];
		elem1.value = selectloansArray[i];
	};
	console.log(selectloansArray);
};

//autofills gift select with range of 7-14
 function autofillselectGift(){
	 var selectgiftArray = [];
	 var getRanged = function(min, max){
		var randomnumber2 = Math.floor(Math.random() * (max - min)) + min;
		return randomnumber2;
	 };
	 for(x=0; x<4; x++){
		selectgiftArray[x] = getRanged(7,14);
		var elem2  = $('.giftType')[x];
		elem2.value = selectgiftArray[x];
	 }; 
	 console.log(selectgiftArray);
};

function autoSelect(){
	autofill();
	autofillSelectLoans();
	autofillselectGift();
};
