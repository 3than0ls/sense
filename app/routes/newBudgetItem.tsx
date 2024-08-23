import { ActionFunctionArgs } from '@remix-run/node'

export async function loader({ request }: ActionFunctionArgs) {
    // you shuld NOT be able to navigate here... redirect immediately!
    // TODO
    return {}
}

export async function action({ request }: ActionFunctionArgs) {
    const data = await request.formData()
    // parse
    // TODO
    console.log(
        'received request to create new budget item in category',
        data.get('budgetCategoryId') as string
    )
    return {}
}
