import { json, LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { isAuthApiError } from '@supabase/supabase-js'
import Budget from '~/components/budget/Budget'
import ServerErrorResponse from '~/error'
import authenticateUser from '~/utils/authenticateUser'
import fullBudgetData from '~/prisma/fullBudgetData'
import { BudgetDataProvider } from '~/context/BudgetDataContext'
import stopRevalidate from '~/utils/stopRevalidation'
import { BudgetUXProvider } from '~/context/BudgetUXContext'

let ticker = 0

export async function loader({ request, params }: LoaderFunctionArgs) {
    // THE PERFECT LOADER SAMPLE:
    // do literally every route loader now.
    try {
        const { user } = await authenticateUser(request)

        const budgetData = await fullBudgetData({
            userId: user.id,
            budgetId: params.budgetId!,
        })

        console.log('refetching budget data for the x time:', ticker)
        ticker++

        return json({ budgetData })
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

export const shouldRevalidate = stopRevalidate

export default function BudgetRoute() {
    const { budgetData } = useLoaderData<typeof loader>()

    // const budgetDataMemo = useMemo(() => budgetData, [budgetData])

    // there are typescript issues due to Date objects being converted to strings when being sent from loader to component
    // hence why the "as never"; however we MUST reconstruct dates everytime we want to use them
    // in components, otherwise severe error
    return (
        <BudgetDataProvider budgetData={budgetData}>
            <BudgetUXProvider>
                <Budget />
            </BudgetUXProvider>
        </BudgetDataProvider>
    )
}
