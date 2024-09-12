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

Add reconciliations in Account (hard)  <--- NEXT 4.0

finish account topbar (medium) (have to make design decisions) <--- NEXT 4.1

Make transaction have optional budget item; if it doesn't have a budget item, it just goes into free cash (hard) <---- NEXT 1.0
- will have to make Free Cash an option for add transaction dropdown

If there's only one option for Dropdown, make it the default option (easy) <---- NEXT 1.1

Assign money inflow AND outflow (hard) <--- related to 1.0
- transactions will stay positive (but still subtract), and there will just be an option to click inflow or outflow
- inflow or outflow option will be in the zod schema, but only determine on server whether to make amount negative or position
- thus the value will still work in calculations of balance

when money is fully spent, budget item expanded bar looks funny, + tip needs to be fixed when 0 left to spend; styling in general for BIExpandedBar is just off <--- NEXT 2

transaction on budgetmenu base, make it so that if there is a budget item also navigated to, automatically make that the budget item target (easy) <--- NEXT 3

prisma optimization by only fetching what's needed, and then also correct type annotations using Pick

FUTURE NON ESSENTIALS:
transaction to more than one item
single generic DeleteForm component that also handles loading state before closing, then apply it to transaction deletion (cuz I didnt do that)
add date to add transaction using https://ui.shadcn.com/docs/components/date-picker
replace Dropdown with shadcn's more sophisticated combobox (see dropdown menu) https://ui.shadcn.com/docs/components/combobox
replace AccountTransaction's table with shadcn's Resizeable so column widths are draggable (https://ui.shadcn.com/docs/components/resizable). Perhaps some more advanced features to, including searching, filtering, and sorting
optimistic UI; easily implemented for BudgetMenuForm on budget item's transaction
clip the modal scrollbar with rounded corners
