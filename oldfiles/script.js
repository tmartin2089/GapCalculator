function sumBio(){
	var bio= [];
	$('.bio').each(function(index){
		if(isNaN(parseInt($(this.val())))){
			alert('Please use numbers in all fields');
		}
		else{
			bio.push(parseInt($(this)))
		}
	})

}