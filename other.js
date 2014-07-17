
$(document).ready(addLinks());


function addLinks () {
    for (var i=0, link; i<5; i++) {
        link = document.createElement("a");
        link.innerHTML = "Link " + i;
        link.onclick = function (num) {
            return function () {
                console.log(num);
            };
        }(i);
		
		//the above evalutes to link.onclick(i), but it's saving
		//each instantiation 
		
		//for each iteration step the outer function literal 
		//will evaluate to a new function object with its own 
		//scope and local variable num, whose value is set to 
		//the current value of i. As num is never modified, 
		//it will stay constant over the lifetime of the 
		//closure: The next iteration step doesn't overwrite 
		//the old value as the function objects are independent.
        document.body.appendChild(link);
    }
}