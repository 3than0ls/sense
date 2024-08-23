import { ActionFunctionArgs } from '@remix-run/node'

export async function action({ request }: ActionFunctionArgs) {
    const data = await request.formData()
    console.log('received request to change budget item name', data)
    // const parsed = schema.parse(Object.fromEntries(data))
    // // TODO

    // console.log('updating budget item name ', parsed)
    // return {
    //     TEMP_DELETE_CAT_NAME: parsed.name,
    // }
    return null
}
