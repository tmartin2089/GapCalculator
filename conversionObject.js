//Leave untouched - this is used for conversion of P6 paste information into a useable object for calculations

//future dev - barring major Title IV reg changes, the only thing that should ever need to be tinkered with is needRank and costRank, as these determine the order in which reductions are made

//why 42?  needed an arbitrary high number,  since sort couldn't handle a non-number when sorting, and it's important to know how many roads a man must walk down before you can call him a man 

//Added in preliminary disbursed: t/f property.  This will allow future version of calculator to figure out net amount (minus orig fees).  Likely will run into issues where not having a disbursed property will render a false positive (undefined == falsey) - so adding to all 

//-------------current costRank index------------------//
/*
	1. CAL/Alt
	2. PLUS
	3. Unsub
	4. B On Time
	5. Perkins
	6. Subsidized Loan
	7. FWS
	8. TPEG
	9. UT Grant
	10. Partial Tuition Grant
	11. TEXAS Grant Match
	12. TEXAS Grant
	13. Cost Impacted UT Scholarships
*/
//-------------end costRank index------------------//


//-------------current needRank index------------------//
/*
	1. Perkins
	2. Subsidized Loan
	3. FWS
	4. TPEG
	5. UT Grant
	6. Partial Tuition Grant
	7. TEXAS Grant Match
	8. TEXAS Grant
*/
//-------------end needRank index------------------//		

function convertAid(type, val8, index){
	var aidType = {
		
		//plus
		"215025": {type: "PLUS Loan", amount: val8, needBased: false, needRank: 42, costRank: 2, sacred: false, position: index, disbursed: false}, 
		"215026": {type: "PLUS Loan", amount: val8, needBased: false, needRank: 42, costRank: 2, sacred: false, position: index, disbursed: true}, 
		"215125": {type: "PLUS Loan", amount: val8, needBased: false, needRank: 42, costRank: 2, sacred: false, position: index, disbursed: false}, 
		"215126": {type: "PLUS Loan", amount: val8, needBased: false, needRank: 42, costRank: 2, sacred: false, position: index, disbursed: true}, 
		
		//unsub
		"214125": {type: "Unsub Loan", amount: val8, needBased: false, needRank: 42, costRank: 3, sacred: false, position: index, disbursed: false},
		"214126": {type: "Unsub Loan", amount: val8, needBased: false, needRank: 42, costRank: 3, sacred: false, position: index, disbursed: true},  
		
		//cal & alt
		"222001": {type: "CAL/Alt Loan", amount: val8, needBased: false, needRank: 42, costRank: 1, sacred: false, position: index, disbursed: false},
		"222002": {type: "CAL/Alt Loan", amount: val8, needBased: false, needRank: 42, costRank: 1, sacred: false, position: index, disbursed: false},
		"241002": {type: "CAL/Alt Loan", amount: val8, needBased: false, needRank: 42, costRank: 1, sacred: false, position: index, disbursed: false},
		"241003": {type: "CAL/Alt Loan", amount: val8, needBased: false, needRank: 42, costRank: 1, sacred: false, position: index, disbursed: false},
																				   
		//be on time
		"223001": {type: "B On Time", amount: val8, needBased: false, needRank: 42, costRank: 4, sacred: false, position: index, disbursed: false},
		"223002": {type: "B On Time", amount: val8, needBased: false, needRank: 42, costRank: 4, sacred: false, position: index, disbursed: false},
		"223003": {type: "B On Time", amount: val8, needBased: false, needRank: 42, costRank: 4, sacred: false, position: index, disbursed: false},
		"223004": {type: "B On Time", amount: val8, needBased: false, needRank: 42, costRank: 4, sacred: false, position: index, disbursed: false},
																				
		//sub
		"214025": {type: "Sub Loan", amount: val8, needBased: true, needRank: 2, costRank: 6, sacred: false, position: index, disbursed: false},
		"214026": {type: "Sub Loan", amount: val8, needBased: true, needRank: 2, costRank: 6, sacred: false, position: index, disbursed: true},
		
		//Oerkins
		"213003": {type: "Perkins", amount: val8, needBased: true, needRank: 1, costRank: 5, sacred: false, position: index, disbursed: false},
		
		//UT grant
	    "131252": {type: "UT Grant", amount: val8, needBased: true, needRank: 5, costRank: 9, sacred: false, position: index, disbursed: false},
		"131253": {type: "UT Grant", amount: val8, needBased: true, needRank: 5, costRank: 9, sacred: false, position: index, disbursed: false},
		"131254": {type: "UT Grant", amount: val8, needBased: true, needRank: 5, costRank: 9, sacred: false, position: index, disbursed: false},
		"131255": {type: "UT Grant", amount: val8, needBased: true, needRank: 5, costRank: 9, sacred: false, position: index, disbursed: false},
		"131256": {type: "UT Grant", amount: val8, needBased: true, needRank: 5, costRank: 9, sacred: false, position: index, disbursed: false},
		"131257": {type: "UT Grant", amount: val8, needBased: true, needRank: 5, costRank: 9, sacred: false, position: index, disbursed: false},
																						   
		//TPEG
		"131115": {type: "TPEG", amount: val8, needBased: true, needRank: 4, costRank: 8, sacred: false, position: index, disbursed: false},
		"131110": {type: "TPEG", amount: val8, needBased: true, needRank: 4, costRank: 8, sacred: false, position: index, disbursed: false},
		"131116": {type: "TPEG", amount: val8, needBased: true, needRank: 4, costRank: 8, sacred: false, position: index, disbursed: false},
		"131111": {type: "TPEG", amount: val8, needBased: true, needRank: 4, costRank: 8, sacred: false, position: index, disbursed: false},
		"131117": {type: "TPEG", amount: val8, needBased: true, needRank: 4, costRank: 8, sacred: false, position: index, disbursed: false},
		"131118": {type: "TPEG", amount: val8, needBased: true, needRank: 4, costRank: 8, sacred: false, position: index, disbursed: false},
		
		//Partial Tuition 
		"131200": {type: "Partial Tuition", amount: val8, needBased: true, needRank: 6, costRank: 10, sacred: false, position: index, disbursed: false},
		"131201": {type: "Partial Tuition", amount: val8, needBased: true, needRank: 6, costRank: 10, sacred: false, position: index, disbursed: false},
		"131202": {type: "Partial Tuition", amount: val8, needBased: true, needRank: 6, costRank: 10, sacred: false, position: index, disbursed: false},
																								  
		//TEXAS grant
		"121176": {type: "TEXAS Grant", amount: val8, needBased: true, needRank: 8, costRank: 12, sacred: false, position: index, disbursed: false},
		"121178": {type: "TEXAS Grant", amount: val8, needBased: true, needRank: 8, costRank: 12, sacred: false, position: index, disbursed: false},
		"121180": {type: "TEXAS Grant", amount: val8, needBased: true, needRank: 8, costRank: 12, sacred: false, position: index, disbursed: false},
		
		//TX grant match   - should be reduced for need before TX Grant
		"131114": {type: "TEXAS Match", amount: val8, needBased: true, needRank: 7, costRank: 11, sacred: false, position: index, disbursed: false},
		
		//New for 15/16 - OSFS scholarships impacted by cost
		"331278": {type: "5th Year Acct", amount: val8, needBased: true, needRank: 42, costRank: 13, sacred: false, position: index, disbursed: false},
		"331401": {type: "LPCA", amount: val8, needBased: true, needRank: 42, costRank: 13, sacred: false, position: index, disbursed: false},
		"331402": {type: "LPCA", amount: val8, needBased: true, needRank: 42, costRank: 13, sacred: false, position: index, disbursed: false},
		"331403": {type: "LPCA", amount: val8, needBased: true, needRank: 42, costRank: 13, sacred: false, position: index, disbursed: false},
		"331439": {type: "Longhorn Guaranty", amount: val8, needBased: true, needRank: 42, costRank: 13, sacred: false, position: index, disbursed: false},
		"331458": {type: "ULN", amount: val8, needBased: true, needRank: 42, costRank: 13, sacred: false, position: index, disbursed: false},
		"331459": {type: "PAS", amount: val8, needBased: true, needRank: 42, costRank: 13, sacred: false, position: index, disbursed: false},
		"331460": {type: "PAS", amount: val8, needBased: true, needRank: 42, costRank: 13, sacred: false, position: index, disbursed: false},
		"331461": {type: "PAS", amount: val8, needBased: true, needRank: 42, costRank: 13, sacred: false, position: index, disbursed: false},
		"331462": {type: "Posse", amount: val8, needBased: true, needRank: 42, costRank: 13, sacred: false, position: index, disbursed: false},
		"341159": {type: "Terry", amount: val8, needBased: true, needRank: 42, costRank: 13, sacred: false, position: index, disbursed: false},
		"341160": {type: "Terry Transfer", amount: val8, needBased: true, needRank: 42, costRank: 13, sacred: false, position: index, disbursed: false},
		"341161": {type: "Terry Transfer", amount: val8, needBased: true, needRank: 42, costRank: 13, sacred: false, position: index, disbursed: false},
		"341162": {type: "Gates", amount: val8, needBased: true, needRank: 42, costRank: 13, sacred: false, position: index, disbursed: false},
		"341163": {type: "Gates", amount: val8, needBased: true, needRank: 42, costRank: 13, sacred: false, position: index, disbursed: false},
		
		//FWS
		"411001": {type: "Work-Study", amount: val8, needBased: true, needRank: 3, costRank: 7, sacred: false, position: index, disbursed: false},
		
		//Pell
		"111028": {type: "Pell", amount: val8, needBased: true, needRank: 42, costRank:42, sacred: true, position: index, disbursed: false},
		"111029": {type: "Pell", amount: val8, needBased: true, needRank: 42, costRank:42, sacred: true, position: index, disbursed: false},
																		  
		//Top 10%
		"321380": {type: "Top 10%", amount: val8, needBased: true, needRank: 42, costRank:42, sacred: true, position: index, disbursed: false},
		"321396": {type: "Top 10%", amount: val8, needBased: true, needRank: 42, costRank:42, sacred: true, position: index, disbursed: false},
		
		//OSFS scholarship
		"331000": {type: "OSFS Scholarship", amount: val8, needBased:true, needRank: 42, costRank:42, sacred: true, position: index, disbursed: false}
		};
	return aidType[type]
}



function costEntitlements(type){
	return{
		"331278": "I\'m an entitlement but I\'m impacted by aid",
		"331401": "I\'m an entitlement but I\'m impacted by aid",
		"331402": "I\'m an entitlement but I\'m impacted by aid",
		"331403": "I\'m an entitlement but I\'m impacted by aid",
		"331439": "I\'m an entitlement but I\'m impacted by aid",
		"331458": "I\'m an entitlement but I\'m impacted by aid",
		"331459": "I\'m an entitlement but I\'m impacted by aid",
		"331460": "I\'m an entitlement but I\'m impacted by aid",
		"331461": "I\'m an entitlement but I\'m impacted by aid",
		"331462": "I\'m an entitlement but I\'m impacted by aid",
		"341159": "I\'m an entitlement but I\'m impacted by aid",
		"341160": "I\'m an entitlement but I\'m impacted by aid",
		"341161": "I\'m an entitlement but I\'m impacted by aid",
		"341162": "I\'m an entitlement but I\'m impacted by aid",
		"341163": "I\'m an entitlement but I\'m impacted by aid"
	}[type];	
}
		