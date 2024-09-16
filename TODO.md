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
Sidebar (medium) (have to make design decisions)

when money is fully spent, budget item expanded bar looks funny, + tip needs to be fixed when 0 left to spend; styling in general for BIExpandedBar is just off <--- NEXT!!!

CreateUpdate form, don't say create (x), maybe just say add or make (EASY)

Reconcile account make the whole text blob a dropdown

- fullBudgetData will also fetch all transactions for that month in calculating spent, thus it also refreshes monthly to zero

VASTLY simplify budgetValues, universally use totalAmount, with few other exceptions, rather than whatever is used now (EASY)

autofocus inputs when clicking on ThreeValues

prisma optimization by only fetching what's needed, and then also correct type annotations using Pick

FUTURE NON ESSENTIALS:
transaction to more than one item
single generic DeleteForm component that also handles loading state before closing, then apply it to transaction deletion (cuz I didnt do that)
add date to add transaction using https://ui.shadcn.com/docs/components/date-picker
replace Dropdown with shadcn's more sophisticated combobox (see dropdown menu) https://ui.shadcn.com/docs/components/combobox
replace AccountTransaction's table with shadcn's Resizeable so column widths are draggable (https://ui.shadcn.com/docs/components/resizable). Perhaps some more advanced features to, including searching, filtering, and sorting
optimistic UI; easily implemented for BudgetMenuForm on budget item's transaction
clip the modal scrollbar with rounded corners

KNOWN BUGS:
In account reconciliation, if you type a exponential number (ex: 4e10), the reconciliation amount preview will display as if valid
