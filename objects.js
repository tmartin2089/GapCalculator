function loan(needRank, costRank, name){
	this.needRank = needRank;
	this.name = name;
	this.costRank = costRank;
}


var subsidizedLoan = new loan(1,2,"sub");

console.log(subsidizedLoan);