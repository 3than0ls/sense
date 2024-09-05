import { ActionFunctionArgs, json } from '@remix-run/node'
import { z } from 'zod'
import ServerErrorResponse from '~/error'
import prisma from '~/prisma/client'
import authenticateUser from '~/utils/authenticateUser'

const uuid = z.string().uuid()

export async function action({ request }: ActionFunctionArgs) {
    try {
        const data = await request.formData()
        const budgetId = uuid.parse(data.get('budgetId'))

        const { user } = await authenticateUser(request)

        const deleteBudget = await prisma.budget.delete({
            where: {
                id: budgetId,
                userId: user.id,
            },
        })

        return json(deleteBudget)
    } catch (e) {
        throw new ServerErrorResponse()
    }
}
