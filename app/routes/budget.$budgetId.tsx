import { LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import Budget from '~/components/budget/Budget'
import { BudgetFullType } from '~/context/BudgetContext'
import fakeData from '~/utils/fakeData'

export async function loader({ params }: LoaderFunctionArgs) {
    console.log('LOADING BUDGET ID', params.budgetId)
    // fetch budget from database using budgetId
    // get user from supabase auth getUser
    // ensure userId from budget and user.id from supabase auth match
    // if not, redirect to home
    // if yes, return budget data

    // in the meantime, here's some fake data
    return fakeData()
}

export default function BudgetRoute() {
    const data = useLoaderData<typeof loader>()

    // definitely going to have to use outlet?
    return <Budget budgetData={data as unknown as BudgetFullType} />
}
