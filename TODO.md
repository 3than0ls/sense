=-- Misc. --=
A name for the projecte

NEXT: 

Sidebar (medium) (have to make design decisions)

fullBudgetData will also fetch all transactions for that month in calculating spent, thus it also refreshes monthly to zero (MEDIUM)
- fetch transactions only of the month to date, allowing balance to refresh monthly

REDIRECT on missing budgets and etc.

rework/delete order

FUTURE NON ESSENTIALS:
transaction to more than one item
single generic DeleteForm component that also handles loading state before closing, then apply it to transaction deletion (cuz I didnt do that)
add date to add transaction using https://ui.shadcn.com/docs/components/date-picker
replace Dropdown with shadcn's more sophisticated combobox (see dropdown menu) https://ui.shadcn.com/docs/components/combobox
replace AccountTransaction's table with shadcn's Resizeable so column widths are draggable (https://ui.shadcn.com/docs/components/resizable). Perhaps some more advanced features to, including searching, filtering, and sorting
clip the modal scrollbar with rounded corners
optimize prisma reads by fetching only what's needed, and correctly specifying so in type annotations
instead of truncating numbers, round them into nearest thousandth

KNOWN BUGS:
In account reconciliation, if you type a exponential number (ex: 4e10), the reconciliation amount preview will display as if valid
When the page is already up, if clicking on ThreeValues to refocus input focus (searchParams), it doesn't work