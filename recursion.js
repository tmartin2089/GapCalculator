//a
var overNeed = 5000;
var needAid = [{type:5, amt:478},{type: 6, amt:500},{type:5, amt:347},{type: 6, amt:522}];
//c
var totalNeedaid = 1738;  //will need to sum up amt w/o including sacredAid 

function revise(a,b,c,d){
	if(a <= 0 || b >= d.length){   //base case  totalNeed is less than 
        //at end of revise - if negative then too much was taken away
		//this returns negative as positive remainder for re-adding
		if(a < 0){
			var remainder =(Math.abs(a));
			console.log(d);
		}
		else{
			var overage = a;
			console.log('To be taken from any grants $' + a);
		};
				console.log(remainder);       //will need to re-add remainder to aid
				console.log(a);				  //return outside of function - new fn to rebuild
		}
	else{
		a -= d[b].amt;
		c -= d[b].amt;
		d[b].amt = 0, 
		console.log(d);
		console.log(a);
		return a + revise(a,b+1,c,d);
		};
}

