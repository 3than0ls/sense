import { json, LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { isAuthApiError } from '@supabase/supabase-js'
import Budget from '~/components/budget/Budget'
import { BudgetFullType } from '~/context/BudgetContext'
import ServerErrorResponse from '~/error'
import prisma from '~/prisma/client'
import authenticateUser from '~/utils/authenticateUser'

export async function loader({ request, params }: LoaderFunctionArgs) {
    // THE PERFECT LOADER SAMPLE
    try {
        const { user } = await authenticateUser(request)

        const budget = await prisma.budget.findFirst({
            where: {
                id: params.budgetId,
                userId: user.id,
            },
            include: {
                budgetCategories: {
                    include: {
                        budgetItems: true,
                    },
                },
            },
        })
        if (budget === null) {
            throw new Error()
        }

        return json(budget)
    } catch (e) {
        if (isAuthApiError(e)) {
            throw new ServerErrorResponse(e)
        } else {
            throw new ServerErrorResponse({
                message: 'Budget not found.',
                status: 404,
            })
        }
    }
}

export default function BudgetRoute() {
    const data = useLoaderData<typeof loader>()

    // definitely going to have to use outlet?
    return <Budget budgetData={data as unknown as BudgetFullType} />
}
