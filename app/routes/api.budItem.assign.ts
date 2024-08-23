import { ActionFunctionArgs } from '@remix-run/node'

/*
Could also be called: budget.$budgetId.$budgetCategoryId.$budgetItemId.assign.tsx
But names seem to be getting longer and longer...
But then again having a vague thing here is also vague.
A decision will be made later; code remains the same
*/

export async function loader({ request }: ActionFunctionArgs) {
    // you shuld NOT be able to navigate here... redirect immediately!
    // TODO
    return {}
}

export async function action({ request }: ActionFunctionArgs) {
    const data = await request.formData()
    // TODO
    console.log(
        'received request to assign money to a budget item of ID with request data',
        data
    )
    return {}
}
