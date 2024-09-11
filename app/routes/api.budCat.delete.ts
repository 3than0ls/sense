import { ActionFunctionArgs, json, redirect } from '@remix-run/node'
import { z } from 'zod'
import ServerErrorResponse from '~/error'
import prisma from '~/prisma/client'
import authenticateUser from '~/utils/authenticateUser'

const uuid = z.string().uuid()

export async function action({ request }: ActionFunctionArgs) {
    try {
        const data = await request.formData()
        const budCatId = uuid.parse(data.get('budgetCategoryId'))

        const { user } = await authenticateUser(request)

        const deleteCat = await prisma.budgetCategory.delete({
            where: {
                id: budCatId,
                budget: {
                    userId: user.id,
                },
            },
        })

        return redirect(`/budget/${deleteCat.budgetId}`)
    } catch (e) {
        throw new ServerErrorResponse({
            message: 'Budget Category unable to be deleted.',
            status: 400,
        })
    }
}
