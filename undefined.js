var Loanarray = [{type:5, amt:1000},{type:6, amt:1000}];

function recursion(overamt,end,needArray){
	if(overamt <= 0 || end >= needArray.length){ 
		if(overamt < 0){  
			var remainder =(Math.abs(overamt));
			console.log(needArray);
			console.log('Can keep $' + remainder); 	
		}
		else{
			var remainOver = overamt;
			console.log(needArray);
            console.log(remainOver);
			console.log('To be taken away $' + overamt);	
		};
	}	
	else{
		overamt -= needArray[end].amt;
		needArray[end].amt = 0; 
		return recursion(overamt,end+1,needArray);
	};
	console.log('hi');
	console.log('is it being returned here at least?' + remainOver);
	
	return{
	remainOver: remainOver,
	}
	console.log(loansFirst);
}

function doEverything(){
    var result = recursion(10849,0,Loanarray);
    var remainOver = result.remainOver;
    console.log(remainOver);
}