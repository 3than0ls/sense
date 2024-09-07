import { LoaderFunctionArgs } from '@remix-run/node'
import { json, useLoaderData } from '@remix-run/react'
import { isAuthApiError } from '@supabase/supabase-js'
import Account from '~/components/account/Account'
import ServerErrorResponse from '~/error'
import fullAccountData, { FullAccountDataType } from '~/prisma/fullAccountData'
import authenticateUser from '~/utils/authenticateUser'

export async function loader({ request, params }: LoaderFunctionArgs) {
    // the same loader as budget.tsx because both use Sidebar
    try {
        const { user } = await authenticateUser(request)

        const accountData = await fullAccountData({
            userId: user.id,
            accountId: params.accountId!,
        })

        return json({ accountData })
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
    const { accountData } = useLoaderData<typeof loader>()

    return (
        <Account accountData={accountData as unknown as FullAccountDataType} />
    )
}
