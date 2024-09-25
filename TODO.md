# TODO

REDIRECT on missing budgets and etc.

THE OPTIMISTIC UI REWORK:
All client data is completely managed by BudgetContext, all shown data on client side originates from BudgetContext
Preceding EVERY single API call, call setBudgetData and change/update the appropriate values
Refactor `budget.$budgetId.$budgetCategoryId.$budgetItemId.tsx` and `budget.$budgetId.$budgetCategoryId.tsx` to just `/i` and `/c`, and more importantly removing their loaders and simply just useBudgetData(). This will give a more instant response to clicks.
Refactor `accounts.$accountId.tsx` to `budget.$budgetId.a.$accountId` so they too can access budgetData context
Will likely have to rework BudgetMenuForm a bit.


NEXT: Put expensive computations in useMemo (<https://react.dev/reference/react/useMemo#usememo>) [test this]

NEXT: SIDEBAR CREATE BUDEGET BUTTON


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