import { ActionFunctionArgs, redirect } from '@remix-run/node'
import { z } from 'zod'
import ServerErrorResponse from '~/error'
import prisma from '~/prisma/client'
import authenticateUser from '~/utils/authenticateUser'

const uuid = z.string().uuid()
/*
 In `budget.$budgetId.$budgetCategoryId.tsx`
 
  fetcher.submit(
        {
            budgetCategoryId: budgetCategory.id,
        },
        { action: '/api/budCat/newItem', method: 'POST' }
    )
 */
export async function action({ request }: ActionFunctionArgs) {
    try {
        const data = await request.formData()
        const budCatId = uuid.parse(data.get('budgetCategoryId'))

        const { user } = await authenticateUser(request)

        const budgetCategory = await prisma.budgetCategory.findUniqueOrThrow({
            where: {
                budget: {
                    userId: user.id,
                },
                id: budCatId,
            },
            include: {
                _count: { select: { budgetItems: true } },
            },
        })

        const budgetItem = await prisma.budgetItem.create({
            data: {
                name: 'New Item',
                target: 0,
                budgetId: budgetCategory.budgetId,
                budgetCategoryId: budgetCategory.id,
            },
        })

        return redirect(
            `/budget/${budgetCategory.budgetId}/i/${budgetItem.id}?f=itname`
        )
    } catch (e) {
        throw new ServerErrorResponse()
    }
}
