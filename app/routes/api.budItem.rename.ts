import { ActionFunctionArgs, json } from '@remix-run/node'
import ServerErrorResponse from '~/error'
import prisma from '~/prisma/client'
import authenticateUser from '~/utils/authenticateUser'
import { itemNameSchema } from '~/zodSchemas/budgetItem'

export async function action({ request }: ActionFunctionArgs) {
    try {
        const data = await request.formData()
        const { name, id } = itemNameSchema.parse(Object.fromEntries(data))

        const { user } = await authenticateUser(request)

        const updatedItem = await prisma.budgetItem.update({
            where: {
                id: id,
                budget: {
                    userId: user.id,
                },
            },
            data: {
                name: name,
            },
        })

        return json(updatedItem)
    } catch (e) {
        throw new ServerErrorResponse()
    }
}
