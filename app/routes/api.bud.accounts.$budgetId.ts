import { json, LoaderFunctionArgs, redirect } from '@remix-run/node'
import { isAuthApiError } from '@supabase/supabase-js'
import ServerErrorResponse from '~/error'
import prisma from '~/prisma/client'
import authenticateUser from '~/utils/authenticateUser'

export async function loader({ params, request }: LoaderFunctionArgs) {
    try {
        const { user } = await authenticateUser(request)

        const allAccounts = await prisma.account.findMany({
            select: {
                name: true,
                id: true,
            },
            where: {
                budgetId: params.budgetId,
                budget: {
                    userId: user.id,
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
        })

        return json(allAccounts)
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
