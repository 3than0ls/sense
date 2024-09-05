TODO list:
--- Backend ---
API routes (action) for creating (POST) Budget, BudgetCategory, BudgetItem, Account, Transaction
API routes (action) for editing (POST) Budget, BudgetCategory, BudgetItem, Account, Trnasaction
 - not sure how exactly this will work? should we just send PATCH/update? or do a full PUT/replacement? Tyler's choice
API routes (loader) for getting (GET) Budget, BudgetCategory, BudgetItem, Account, Transaction

--- Middle ---
OAuth account creation?

--- Frontend ---
Form for: (creating an item creates it with some default values which the user then edits, and the edit menu is ofc auto opened)
    - Create/Edit Budget
    - Create/Edit BudgetCategory
    - Create/Edit BudgetItem
    - Create/Edit Account
    - Create/Edit Transaction
Custom scrollbar
Text color change based on budget states (namely red on negative)

--- Misc. ---
A name for the projecte


NEXT: 
Sidebar
Assign money inflow AND outflow
Account menu
Custom scrollbar
Transaction modal UI
topbar decision- keep it when in budget or not?
budget item dropdown things  (TRANSACTION AND BUSINESS)

delete budget/item/category backend (WILL REQUIRE CASCADE PRISMA)


ACCOUNT IS NOW UNDER BUDGEWT, NOT SEPERATE FROM.
add dollar sign in front of inputs that require dollar signs
