import { json, LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { isAuthApiError } from '@supabase/supabase-js'
import Budget from '~/components/budget/Budget'
import ServerErrorResponse from '~/error'
import authenticateUser from '~/utils/authenticateUser'
import fullBudgetData from '~/prisma/fullBudgetData'
import { flattenTransactions } from '~/utils/budgetValues'

export async function loader({ request, params }: LoaderFunctionArgs) {
    // THE PERFECT LOADER SAMPLE:
    // do literally every route loader now.
    try {
        const { user } = await authenticateUser(request)

        const budgetData = await fullBudgetData({
            userId: user.id,
            budgetId: params.budgetId!,
        })

        const budgetTransactions = flattenTransactions(budgetData)

        return json({ budgetData, budgetTransactions })
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
    const { budgetData, budgetTransactions } = useLoaderData<typeof loader>()

    // there are typescript issues due to Date objects being converted to strings when being sent from loader to component
    // hence why the "as never"; however we MUST reconstruct dates everytime we want to use them
    // in components, otherwise severe error
    return (
        <Budget
            budgetData={budgetData as never}
            budgetTransactions={budgetTransactions as never}
        />
    )
}
