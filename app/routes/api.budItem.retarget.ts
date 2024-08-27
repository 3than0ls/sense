import { ActionFunctionArgs, json } from '@remix-run/node'
import ServerErrorResponse from '~/error'
import prisma from '~/prisma/client'
import authenticateUser from '~/utils/authenticateUser'
import { itemTargetSchema } from '~/zodSchemas/budgetItem'

export async function action({ request }: ActionFunctionArgs) {
    try {
        const data = await request.formData()
        const { target, id } = itemTargetSchema.parse(Object.fromEntries(data))
        console.log(target, id)

        const { user } = await authenticateUser(request)

        const updatedItem = await prisma.budgetItem.update({
            where: {
                id: id,
                userId: user.id,
            },
            data: {
                target: target,
            },
        })

        return json(updatedItem)
    } catch (e) {
        throw new ServerErrorResponse()
    }
}
