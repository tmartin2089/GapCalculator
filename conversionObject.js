//Leave untouched - this is used for conversion of P6 paste information into a useable object for calculations

//future dev - barring major Title IV reg changes, the only thing that should ever need to be tinkered with is needRank and costRank, as these determine the order in which reductions are made

//why 42?  needed an arbitrary high number,  since sort couldn't handle a non-number when sorting 

//position: index - need a way to capture input order of p6 awards so that the updated amounts can be redisplayed in the same order.  This means aid can be revised in the order it appears on p6

//-------------current costRank index------------------//
/*
	1.
	2.
	3.
	4.
	5.
	6.
	7.
	8.
	9.
	10.
	11.
	12.
*/
//-------------end costRank index------------------//


//-------------current needRank index------------------//
/*
	1.
	2.
	3.
	4.
	5.
	6.
	7.
	8.
	9.
	10.
	11.
	12.
*/
//-------------end needRank index------------------//		

function convertAid(type, val8, index){
	var aidType = {
		
		//plus
		"215025": {type: "PLUS Loan", amount: val8, needBased: false, needRank: 42, costRank: 2, sacred: false, position: index}, 
		"215026": {type: "PLUS Loan", amount: val8, needBased: false, needRank: 42, costRank: 2, sacred: false, position: index}, 
		"215125": {type: "PLUS Loan", amount: val8, needBased: false, needRank: 42, costRank: 2, sacred: false, position: index}, 
		"215126": {type: "PLUS Loan", amount: val8, needBased: false, needRank: 42, costRank: 2, sacred: false, position: index}, 
		
		//unsub
		"214125": {type: "Unsub Loan", amount: val8, needBased: false, needRank: 42, costRank: 3, sacred: false, position: index},
		"214126": {type: "Unsub Loan", amount: val8, needBased: false, needRank: 42, costRank: 3, sacred: false, position: index},  
		
		//cal & alt
		"222001": {type: "CAL/Alt Loan", amount: val8, needBased: false, needRank: 42, costRank: 1, sacred: false, position: index},
		"222002": {type: "CAL/Alt Loan", amount: val8, needBased: false, needRank: 42, costRank: 1, sacred: false, position: index},
		"241002": {type: "CAL/Alt Loan", amount: val8, needBased: false, needRank: 42, costRank: 1, sacred: false, position: index},
		"241003": {type: "CAL/Alt Loan", amount: val8, needBased: false, needRank: 42, costRank: 1, sacred: false, position: index},
																				   
		//be on time
		"223001": {type: "B On Time", amount: val8, needBased: false, needRank: 42, costRank: 4, sacred: false, position: index},
		"223002": {type: "B On Time", amount: val8, needBased: false, needRank: 42, costRank: 4, sacred: false, position: index},
		"223003": {type: "B On Time", amount: val8, needBased: false, needRank: 42, costRank: 4, sacred: false, position: index},
		"223004": {type: "B On Time", amount: val8, needBased: false, needRank: 42, costRank: 4, sacred: false, position: index},
																				
		//sub
		"214025": {type: "Sub Loan", amount: val8, needBased: true, needRank: 2, costRank: 6, sacred: false, position: index},
		"214026": {type: "Sub Loan", amount: val8, needBased: true, needRank: 2, costRank: 6, sacred: false, position: index},
		
		//perkins
		"213003": {type: "Perkins", amount: val8, needBased: true, needRank: 1, costRank: 5, sacred: false, position: index},
		
		//UT grant
	    "131252": {type: "UT Grant", amount: val8, needBased: true, needRank: 4, costRank: 7, sacred: false, position: index},
		"131253": {type: "UT Grant", amount: val8, needBased: true, needRank: 4, costRank: 7, sacred: false, position: index},
		"131254": {type: "UT Grant", amount: val8, needBased: true, needRank: 4, costRank: 7, sacred: false, position: index},
		"131255": {type: "UT Grant", amount: val8, needBased: true, needRank: 4, costRank: 7, sacred: false, position: index},
		"131256": {type: "UT Grant", amount: val8, needBased: true, needRank: 4, costRank: 7, sacred: false, position: index},
		
		//TPEG
		"131115": {type: "TPEG", amount: val8, needBased: true, needRank: 6, costRank: 10, sacred: false, position: index},
		"131110": {type: "TPEG", amount: val8, needBased: true, needRank: 6, costRank: 10, sacred: false, position: index},
		"131116": {type: "TPEG", amount: val8, needBased: true, needRank: 6, costRank: 10, sacred: false, position: index},
		"131111": {type: "TPEG", amount: val8, needBased: true, needRank: 6, costRank: 10, sacred: false, position: index},
		
		//partial tuition 
		"131200": {type: "Partial Tuition", amount: val8, needBased: true, needRank: 9, costRank: 8, sacred: false, position: index},
		"131201": {type: "Partial Tuition", amount: val8, needBased: true, needRank: 9, costRank: 8, sacred: false, position: index},
		"131202": {type: "Partial Tuition", amount: val8, needBased: true, needRank: 9, costRank: 8, sacred: false, position: index},

		//TEXAS grant
		"121176": {type: "TEXAS Grant", amount: val8, needBased: true, needRank: 8, costRank: 12, sacred: false, position: index},
		"121178": {type: "TEXAS Grant", amount: val8, needBased: true, needRank: 8, costRank: 12, sacred: false, position: index},
		"121180": {type: "TEXAS Grant", amount: val8, needBased: true, needRank: 8, costRank: 12, sacred: false, position: index},
		
		//TX grant match   - should be reduced for need befored TX Grant
		"131114": {type: "TEXAS Match", amount: val8, needBased: true, needRank: 7, costRank: 11, sacred: false, position: index},
		
		//FWS
		"411001": {type: "Work-Study", amount: val8, needBased: true, needRank: 3, costRank: 7, sacred: false, position: index},
		
		//Pell
		"111028": {type: "Pell", amount: val8, needBased: true, needRank: 42, costRank:42, sacred: true, position: index},
		"111029": {type: "Pell", amount: val8, needBased: true, needRank: 42, costRank:42, sacred: true, position: index},
																		  
		//Top 10%
		"321380": {type: "Top 10%", amount: val8, needBased: true, needRank: 42, costRank:42, sacred: true, position: index},
		"321396": {type: "Top 10%", amount: val8, needBased: true, needRank: 42, costRank:42, sacred: true, position: index},
		
		//OSFS scholarship
		"331000": {type: "OSFS Scholarship", amount: val8, needBased:true, needRank: 42, costRank:42, sacred: true, position: index}
		};
	return aidType[type]
}
