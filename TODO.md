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
Sidebar (medium)
Assign money inflow AND outflow (hard)
Custom scrollbar (medium)
topbar decision- keep it when in budget or not? (NO!!!) (easy)
budget item expanded dropdown things  (TRANSACTION AND BUSINESS) (easy)


/// IMMEDIATE CONCERNS
ACCOUNT IS NOW UNDER BUDGEWT, NOT SEPERATE FROM.
add dollar sign in front of inputs that require dollar signs (easy)

Add temporary loading state to add transaction and assign money   <----------- FINISH THESE TWO
see add transaction for how it's done

account edit menu modal (medium)

Add reconciliations in Account (hard)

create budget modal, rather than the weird shit I have now (hard)

FUTURE NON ESSENTIALS:
single generic DeleteForm component that also handles loading state before closing, then apply it to transaction deletion (cuz I didnt do that)
add date to add transaction using https://ui.shadcn.com/docs/components/date-picker
replace Dropdown with shadcn's more sophisticated combobox (see dropdown menu) https://ui.shadcn.com/docs/components/combobox
replace AccountTransaction's table with shadcn's Resizeable so column widths are draggable (https://ui.shadcn.com/docs/components/resizable). Perhaps some more advanced features to, including searching, filtering, and sorting