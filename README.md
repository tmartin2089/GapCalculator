GapCalculator
=============

title IV revision calculator
Configuring Need/Cost/GAP rules for Title IV and institutional aid

 ++++++++++++++++++++++
 +Future to do        +
 ++++++++++++++++++++++
	I. If entitlements only at end of calc (can check sacred aid === totalaidAmt) -
	modal window to confirm that need/cost is being checked for the year.
	
	II.  Add in graduate student support
	
	III. Hyperlink - Is this AR code a resource?
	
	IV.  Add in form validation elements for each field
	
	V. CSS styling - need to differentiate each field.
	
	VI - change buttons into css divs - easier for stylin'


 ++++++++++++++++++++++
 +Gather Form Elements+
 ++++++++++++++++++++++
 
 gatherBio() -  Gathers COA/EFC/ST RES GIFT
 
 gatherAidamt() - Takes amounts from text input fields and saves to array
 
 gatherAidtype() - Takes values from select fields and saves to array
 
 megaArray() - join gatherAidamt() and gatherAidtype() into one large array 
 w/ type & amt key/value pairs
 
 
 
 
 ++++++++++++++++++++++
 +Check Need and Cost+
 ++++++++++++++++++++++
 determineNeed() - Totals Federal Need by subtracting EFC and ST RES GIFT from COA
 
 totalAid() - sum up all aid and resources
 
 sumNeed() - sum up all need based aid
 
 sumNonNeed() - sum up all non-need based aid
 
 checkCost() - Checks if over cost  - COA - totalAid()
 
 checkNeed() - Checks if over need - subtracts total need aid/sumNeed() from 
 Federal Need/determineNeed()- if awarded over need will return a negative number
 
 needbasedLoans() - separates need based loans into separate array to be reduced
 first for need
 
 nbloanamt() - sums up total amount of need based loans
 
 nbgrantamt() - sums up total amount of grants - INCLUDES ENTITLEMENTS

 needbasedGrants() - separates grants into separate array to be reduced for need
 after loans if necessary - DOES NOT INCLUDE ENTITLEMENTS
 
 ALLneedbasedGrants() - separates grants into separate array for 
 totaling amt purposes - INCLUDES ENTITLEMENTS
 
 findloanOverage() - Uses checkNeed() to determine if over need, if so, subtracts
 total need based loans/nbloanamt() from checkNeed()

 reviseLforNeed() - set all loan amounts to 0 if over need
 
 joinRevisedNBaid() - concatenate revised need arrays for later comparison