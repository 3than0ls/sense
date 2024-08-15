import { ActionFunctionArgs } from '@remix-run/node'

export async function loader({ request }: ActionFunctionArgs) {
    // you shuld NOT be able to navigate here... redirect immediately!
    // TODO
    return {}
}

export async function action({ request, params }: ActionFunctionArgs) {
    // TODO
    console.log(
        'received request to create new budget item in category',
        params.budgetCategoryId
    )
    return {}
}
