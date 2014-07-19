
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


function autofill(){
	var array1= [];
	for(var i=0; i<8; i++){
		var randomnumber = Math.floor((Math.random() * 8000)+1);
		array1[i] = randomnumber;
		var elem = $('.amount')[i];  //returns DOM object unlike just $('#loanAmt1')
		elem.value =array1[i];       //which would be a jquery object
	};
	console.log(array1);
};

// var select = Math.floor((Math.random() * 8)+1);
// console.log(select);

