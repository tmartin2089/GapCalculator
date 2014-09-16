var typedo = [{type:5, amt:347},{type: 6, amt:522},{type:5, amt:347},{type: 6, amt:522}];

function testME(){
	for(var x=0; x<typedo.length; x++){
		if(typedo[x].type === 5){
		console.log('me worky');
		console.log(typedo[x].type);
		console.log(typeof typedo[x].type);
		};
	};
	typedo.push(55);
	console.log(typeof typedo[4]);
};

console.log(typedo[0].type);

var k = ("500" + 500);

console.log(k);
