import { ActionFunctionArgs, json } from '@remix-run/node'
import ServerErrorResponse from '~/error'
import prisma from '~/prisma/client'
import authenticateUser from '~/utils/authenticateUser'
import categoryNameSchema from '~/zodSchemas/budgetCategory'

export async function action({ request }: ActionFunctionArgs) {
    try {
        const data = await request.formData()
        const { name, id } = categoryNameSchema.parse(Object.fromEntries(data))

        const { user } = await authenticateUser(request)

        const updatedCategory = await prisma.budgetCategory.update({
            where: {
                id: id,
                budget: { userId: user.id },
            },
            data: {
                name: name,
            },
        })

        return json(updatedCategory)
    } catch (e) {
        throw new ServerErrorResponse()
    }
}
