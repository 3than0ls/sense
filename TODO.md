=-- Misc. --=
A name for the projecte

NEXT: 

Sidebar (medium) (have to make design decisions)

fullBudgetData will also fetch all transactions for that month in calculating spent, thus it also refreshes monthly to zero (MEDIUM)
- fetch transactions only of the month to date, allowing balance to refresh monthly =

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
