//below is to auto-populate #paste.paste for testing - for future testing, put a bunch of award codes in JSON, have an AJAX call serve them //up one by one, and have them cross-checked with pre-stored numbers  - would like to be able to do rigorous testing automatically instead of continuing to hope for the best with each effort.

var setp6Values = document.getElementById('paste');
setp6Values.value = "131252 UT Grant-UG  _1500.00 331384 JFDS  __2906 131110 TPEG Residen _2500.00 131200 Partial Tuit __644.00 214125 Unsub Shit __23400.00 214025 Unsub Shit __50 213003 Perksin   ___5000 342000 JFDS  __1331 111028 Pell __2500";
//setp6Values.value = "214125 Unsub Shit __5500.00";

//populates bio windows for easy peasy testing lemon squeezy weezy breezy sneezy uhhhh queasy?  
//am I allowed to get away with breaking scheme if consonance and assonance remain intact?
//var biotestArray = [27516, 1583, 32909, 2500];
var biotestArray = [13000, 1000, 2000, 3000];
var setbioValues = document.getElementsByClassName("bio");

(function(){
	$.each(setbioValues,function(index){
		this.value = biotestArray[index];
	})
}())
