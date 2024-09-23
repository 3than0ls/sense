import { ActionFunctionArgs, redirect } from '@remix-run/node'
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

        const deleteItem = await prisma.budgetItem.delete({
            where: {
                id: budItemId,
                budget: {
                    userId: user.id,
                },
            },
        })

        return redirect(`/budget/${deleteItem.budgetId}`)
    } catch (e) {
        throw new ServerErrorResponse({
            message: 'Budget Item unable to be deleted.',
            status: 400,
        })
    }
}
