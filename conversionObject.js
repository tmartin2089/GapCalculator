//Leave untouched - use for conversion of P6 paste

//future dev - barring major Title IV reg changes, the only thing that should ever need to be tinkered with is needRank and
//costRank, as these determine the order in which reductions are made

function convertAid(type, val8){
	var aidType = {
		
		//plus
		"215025": {type: "PLUS Loan", amount: val8, needBased: false, needRank: "#", costRank: 2, sacred: false}, 
		"215026": {type: "PLUS Loan", amount: val8, needBased: false, needRank: "#", costRank: 2, sacred: false}, 
		"215125": {type: "PLUS Loan", amount: val8, needBased: false, needRank: "#", costRank: 2, sacred: false}, 
		"215126": {type: "PLUS Loan", amount: val8, needBased: false, needRank: "#", costRank: 2, sacred: false}, 
		
		//unsub
		"214125": {type: "Unsub Loan", amount: val8, needBased: false, needRank: "#", costRank: 3, sacred: false},
		"214126": {type: "Unsub Loan", amount: val8, needBased: false, needRank: "#", costRank: 3, sacred: false},  
		
		//cal & alt
		"222001": {type: "CAL/Alt Loan", amount: val8, needBased: false, needRank: "#", costRank: 1, sacred: false},
		"222002": {type: "CAL/Alt Loan", amount: val8, needBased: false, needRank: "#", costRank: 1, sacred: false},
		"241002": {type: "CAL/Alt Loan", amount: val8, needBased: false, needRank: "#", costRank: 1, sacred: false},
		"241003": {type: "CAL/Alt Loan", amount: val8, needBased: false, needRank: "#", costRank: 1, sacred: false},
		
		//be on time
		"223001": {type: "B On Time", amount: val8, needBased: false, needRank: "#", costRank: 4, sacred: false},
		"223002": {type: "B On Time", amount: val8, needBased: false, needRank: "#", costRank: 4, sacred: false},
		"223003": {type: "B On Time", amount: val8, needBased: false, needRank: "#", costRank: 4, sacred: false},
		"223004": {type: "B On Time", amount: val8, needBased: false, needRank: "#", costRank: 4, sacred: false},
		
		//sub
		"214025": {type: "Sub Loan", amount: val8, needBased: true, needRank: 2, costRank: 6, sacred: false},
		"214026": {type: "Sub Loan", amount: val8, needBased: true, needRank: 2, costRank: 6, sacred: false},
		
		//perkins
		"213003": {type: "Perkins", amount: val8, needBased: true, needRank: 1, costRank: 5, sacred: false},
		
		//UT grant
	    "131252": {type: "UT Grant", amount: val8, needBased: true, needRank: 4, costRank: 7, sacred: false},
		"131253": {type: "UT Grant", amount: val8, needBased: true, needRank: 4, costRank: 7, sacred: false},
		"131254": {type: "UT Grant", amount: val8, needBased: true, needRank: 4, costRank: 7, sacred: false},
		"131255": {type: "UT Grant", amount: val8, needBased: true, needRank: 4, costRank: 7, sacred: false},
		"131256": {type: "UT Grant", amount: val8, needBased: true, needRank: 4, costRank: 7, sacred: false},
		
		//TPEG
		"131115": {type: "TPEG", amount: val8, needBased: true, needRank: 6, costRank: 10, sacred: false},
		"131110": {type: "TPEG", amount: val8, needBased: true, needRank: 6, costRank: 10, sacred: false},
		"131116": {type: "TPEG", amount: val8, needBased: true, needRank: 6, costRank: 10, sacred: false},
		"131111": {type: "TPEG", amount: val8, needBased: true, needRank: 6, costRank: 10, sacred: false},
		
		//partial tuition 
		"131200": {type: "Partial Tuition", amount: val8, needBased: true, needRank: 9, costRank: 5, sacred: false},
		"131201": {type: "Partial Tuition", amount: val8, needBased: true, needRank: 9, costRank: 5, sacred: false},
		"131202": {type: "Partial Tuition", amount: val8, needBased: true, needRank: 9, costRank: 5, sacred: false},

		//TEXAS grant
		"121176": {type: "TEXAS Grant", amount: val8, needBased: true, needRank: 8, costRank: 12, sacred: false},
		"121178": {type: "TEXAS Grant", amount: val8, needBased: true, needRank: 8, costRank: 12, sacred: false},
		"121180": {type: "TEXAS Grant", amount: val8, needBased: true, needRank: 8, costRank: 12, sacred: false},
		
		//TX grant match   - should be reduced for need befored TX Grant
		"131114": {type: "TEXAS Match", amount: val8, needBased: true, needRank: 7, costRank: 11, sacred: false},
		
		//FWS
		"411001": {type: "Work-Study", amount: val8, needBased: true, needRank: 3, costRank: 7, sacred: false},
		
		//Pell
		"111028": {type: "Pell", amount: val8, needBased: true, needRank: "#", costRank:"#", sacred: true},
		"111029": {type: "Pell", amount: val8, needBased: true, needRank: "#", costRank:"#", sacred: true},
		
		//Top 10%
		"321380": {type: "Top 10%", amount: val8, needBased: true, needRank: "#", costRank:"#", sacred: true},
		"321396": {type: "Top 10%", amount: val8, needBased: true, needRank: "#", costRank:"#", sacred: true},
		
		//OSFS scholarship
		"331000": {type: "OSFS Scholarship", amount: val8, needBased:true, needRank: "#", costRank:"#", sacred: true}
		
		};
	return aidType[type];
}
