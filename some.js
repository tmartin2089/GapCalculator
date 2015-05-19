

function testSome(array){
	array.some(function(element){
		return element < 10;
	})
}

testSome(array1);