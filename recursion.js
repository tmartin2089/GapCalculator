//a
var overNeed = 1000;
var needAid = [{type:5, amt:347},{type: 6, amt:522},{type:5, amt:347},{type: 6, amt:522}];
//c
var totalNeedaid = 1738;  //will need to sum up amt w/o including sacredAid 
var revisedNeed = []

function revise(a,b,c,d,e){
	if(a <= 0 || b >= d.length){   //base case  totalNeed is less than 
        if(a < 0){
			var remainder =(Math.abs(a));
			console.log(d);
			}
			else{
			console.log(d);
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

