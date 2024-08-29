import { json, LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { isAuthApiError } from '@supabase/supabase-js'
import Budget from '~/components/budget/Budget'
import { BudgetFullType } from '~/context/BudgetContext'
import ServerErrorResponse from '~/error'
import prisma from '~/prisma/client'
import authenticateUser from '~/utils/authenticateUser'
import fullBudgetData, { FullBudgetDataType } from '~/prisma/fullBudgetData'

export async function loader({ request, params }: LoaderFunctionArgs) {
    // THE PERFECT LOADER SAMPLE:
    // do literally every route loader now.
    try {
        const { user } = await authenticateUser(request)

        const budget = await fullBudgetData({
            userId: user.id,
            budgetId: params.budgetId!,
        })

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
    // this is of some obscene type
    const data = useLoaderData<typeof loader>()

    return <Budget budgetData={data as unknown as FullBudgetDataType} />
}
