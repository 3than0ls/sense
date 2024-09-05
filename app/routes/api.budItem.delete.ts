import { ActionFunctionArgs, json } from '@remix-run/node'
import { z } from 'zod'
import ServerErrorResponse from '~/error'
import prisma from '~/prisma/client'
import authenticateUser from '~/utils/authenticateUser'

const uuid = z.string().uuid()

export async function action({ request }: ActionFunctionArgs) {
    try {
        const data = await request.formData()
        const budItemId = uuid.parse(data.get('budgetItemId'))

        const { user } = await authenticateUser(request)

        const budgetItem = await prisma.budgetItem.update({
            where: {
                id: budItemId,
                budget: {
                    userId: user.id,
                },
            },
            data: {
                deleted: true,
            },
        })

        return json(budgetItem)
    } catch (e) {
        throw new ServerErrorResponse()
    }
}
