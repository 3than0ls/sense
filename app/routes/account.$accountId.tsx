import { LoaderFunctionArgs } from '@remix-run/node'
import { json, useLoaderData } from '@remix-run/react'
import { isAuthApiError } from '@supabase/supabase-js'
import Account from '~/components/account/Account'
import ServerErrorResponse from '~/error'
import prisma from '~/prisma/client'
import fullAccountData, {
    basicBudgetData,
    FullAccountType,
} from '~/prisma/fullAccountData'
import authenticateUser from '~/utils/authenticateUser'

export async function loader({ request, params }: LoaderFunctionArgs) {
    // the same loader as budget.tsx because both use Sidebar
    try {
        const { user } = await authenticateUser(request)

        const accountData = await fullAccountData({
            userId: user.id,
            accountId: params.accountId!,
        })

        const _basicBudgetData = await basicBudgetData({
            budgetId: accountData.budgetId,
            userId: user.id,
        })

        return json({ accountData, _basicBudgetData })
    } catch (e) {
        if (isAuthApiError(e)) {
            throw new ServerErrorResponse(e)
        } else {
            throw new ServerErrorResponse({
                message: 'Account not found.',
                status: 404,
            })
        }
    }
}

export default function AccountRoute() {
    const { accountData, _basicBudgetData } = useLoaderData<typeof loader>()

    return (
        <Account basicBudgetData={_basicBudgetData} accountData={accountData} />
    )
}
