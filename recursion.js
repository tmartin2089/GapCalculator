var needAid = [{type:5, amt:347},{type: 6, amt:522},{type:5, amt:347},{type: 6, amt:522}];
var totalNeedaid = 1738;  //will need to sum up amt w/o including sacredAid 
var overNeed = 1600;
var revisedNeed = []

function revise(a,b,c,d,e){
	if(a <= 0 || c <= 0){   //base case  totalNeed is less than 
        console.log(e);
		}
	else{
		var k = d[b].amt;
		a -= k;
		c -= k;
		e.push({amt:d[b].amt = 0, type:d[b].type});
		console.log(k);
		return revise(a,b+1,c,d,e);
		};
}

