import { json, LoaderFunctionArgs, redirect } from '@remix-run/node'
import { isAuthApiError } from '@supabase/supabase-js'
import ServerErrorResponse from '~/error'
import prisma from '~/prisma/client'
import authenticateUser from '~/utils/authenticateUser'

export async function loader({ params, request }: LoaderFunctionArgs) {
    try {
        const { user } = await authenticateUser(request)

        const allBudgetItems = await prisma.budgetItem.findMany({
            select: {
                name: true,
                id: true,
            },
            where: {
                deleted: false,
                budgetId: params.budgetId,
                budget: {
                    userId: user.id,
                },
            },
            orderBy: {
                name: 'asc',
            },
        })

        return json(allBudgetItems)
    } catch (e) {
        if (isAuthApiError(e)) {
            throw new ServerErrorResponse(e)
        } else {
            return redirect(`/budget/${params.budgetId}`)
            // throw new ServerErrorResponse({
            //     message: 'Budget Item not found.',
            //     status: 404,
            // })
        }
    }
}
