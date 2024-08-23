import { ActionFunctionArgs } from '@remix-run/node'
import categoryNameSchema from '~/zodSchemas/budgetCategory'

export async function action({ request }: ActionFunctionArgs) {
    const data = await request.formData()
    const parsed = categoryNameSchema.parse(Object.fromEntries(data))
    // TODO

    console.log('updating category name ', parsed)
    return {
        TEMP_DELETE_CAT_NAME: parsed.name,
    }
}
