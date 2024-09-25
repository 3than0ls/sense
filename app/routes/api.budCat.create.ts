import { ActionFunctionArgs, redirect } from '@remix-run/node'
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

        const budget = await prisma.budget.findFirstOrThrow({
            where: {
                userId: user.id,
                id: budgetId,
            },
        })

        const budgetCategory = await prisma.budgetCategory.create({
            data: {
                name: 'New Category',
                budgetId: budget.id,
            },
        })

        return redirect(
            `/budget/${budgetCategory.budgetId}/c/${budgetCategory.id}?f=catname`
        )
    } catch (e) {
        throw new ServerErrorResponse()
    }
}
