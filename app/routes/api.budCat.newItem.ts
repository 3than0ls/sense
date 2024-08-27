import { ActionFunctionArgs, redirect } from '@remix-run/node'
import { z } from 'zod'
import ServerErrorResponse from '~/error'
import prisma from '~/prisma/client'
import authenticateUser from '~/utils/authenticateUser'

export async function loader({ request }: ActionFunctionArgs) {
    // you shuld NOT be able to navigate here... redirect immediately!
    // TODO
    return {}
}

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
                budgetItems: true,
            },
        })

        const position = budgetCategory.budgetItems.length + 1

        const budgetItem = await prisma.budgetItem.create({
            data: {
                name: 'New Item',
                target: 0,
                budgetId: budgetCategory.budgetId,
                budgetCategoryId: budgetCategory.id,
                order: position,
            },
        })

        return redirect(
            `/budget/${budgetCategory.budgetId}/${budgetCategory.id}/${budgetItem.id}`
        )
    } catch (e) {
        throw new ServerErrorResponse()
    }
}
