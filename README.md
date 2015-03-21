GapCalculator
=============

title IV revision calculator
Configuring Need/Cost rules for Title IV and institutional aid

If you are not involved in Title IV administration in the state of Texas, this will not make much sense to you.

But just for the hell of it, here goes...

Need is determined by subtracting: Parent Contribution, Student Contribution (i.e. the EFC from the FAFSA) and any outside scholarship resources from the Cost of Attendance or budget.

That is, a student with a budget of 13,000 for a semester, a 2000 semester EFC who is receiving a $750 scholarship has a need of 13000-2000-750 = $10,250

That means they can receive $10,250 in need based aid.  If they are have more in need based aid than they have need, reductions to the need based aid have to be made.  However not all need based aid is equal.  Subsidized loans should be reduced first, in order of highest interest rate (changes every July 1st), followed by grants, the order of reduction depends on source (federal, state, local) and what changing budget requires to be reclaimed (if TPEG account is overdrawn, might weight this more heavily than UT grant to recapture more TPEG).

In addition, entitlements (or sacred aid) count against the need based total, but cannot be reduced, so they must remain intact while ensuring they are counted in the need calculation.

Following adjustments for need, the student has to be examined for cost.  Cost is Budget, the student's total financial aid (need and non-need) can't exceed their budget.  Weighting for cost rank functions much the same way as it does for need reductions, except in this case everything is on the table, though the high interest non-need based aid is reduced first.

Entitlements again are not reduced for cost.

The above seems simple, but actually requires a fair amount of training.  GapCalculator removes the need for that training.

And gapCalculator is a holdover from an old calculator I made in excel that also calculated Gift Aid Parameters (no longer really used so not included in this code) that got me interested in coding.

 ++++++++++++++++++++++
 +Future to do        +
 ++++++++++++++++++++++
	I.  Add in form validation DOM elements for each field
	
	II. CSS styling - need to differentiate each field.
	
	III - change buttons into css divs - easier for stylin'

















Below are all old functions from v 1.0 of calculator, no longer needed or used but archiving anyway.
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