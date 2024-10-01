# TODO

Write a README
Find out how to deploy build version of app

FUTURE NON ESSENTIALS:
Add another blob to landing page near the pig
Add Navbar to signin and signup pages
Add About pages
standardize outline theme
have an updatedAt field (see https://stackoverflow.com/a/70806772) for budgets and auto navigate to that on /budget
transaction to more than one item
add date to add transaction using https://ui.shadcn.com/docs/components/date-picker
replace Dropdown with shadcn's more sophisticated combobox (see dropdown menu) https://ui.shadcn.com/docs/components/combobox
replace AccountTransaction's table with shadcn's Resizeable so column widths are draggable (https://ui.shadcn.com/docs/components/resizable). Perhaps some more advanced features to, including searching, filtering, and sorting
clip the modal scrollbar with rounded corners
instead of truncating numbers, round them into nearest thousandth

KNOWN BUGS:
When making a transaction with BudgetItemExpandedTable open, the transaction does not reflect on recent transactions.
In account reconciliation, if you type a exponential number (ex: 4e10), the reconciliation amount preview will display as if valid
