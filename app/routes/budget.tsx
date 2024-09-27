import { json, LoaderFunctionArgs, redirect } from '@remix-run/node'
import { useLoaderData, useOutlet } from '@remix-run/react'
import { isAuthApiError } from '@supabase/supabase-js'
import EmptyContent from '~/components/budget/EmptyContent'
import Sidebar from '~/components/sidebar/Sidebar'
import ServerErrorResponse from '~/error'
import getSidebarData from '~/prisma/sidebarData'
import authenticateUser from '~/utils/authenticateUser'

export async function loader({ request, params }: LoaderFunctionArgs) {
    try {
        const { user } = await authenticateUser(request)

        const sidebarData = await getSidebarData({ userId: user.id })

        if (sidebarData.length > 0 && params.budgetId === undefined) {
            return redirect(`/budget/${sidebarData[0].id}`)
        } else {
            return json(sidebarData)
        }
    } catch (e) {
        if (isAuthApiError(e)) {
            throw new ServerErrorResponse(e)
        } else {
            throw new ServerErrorResponse()
        }
    }
}

export default function View() {
    const sidebarData = useLoaderData<typeof loader>()

    const noBudgets = sidebarData.length === 0

    const outlet = useOutlet()

    // json doesn't have Date type, and so when sent via loader, Date is converted to String, causing type mismatches
    // thus the sidebarData as never, and a few other type castings seen throughout codebase
    return (
        <div className="flex h-full">
            <Sidebar sidebarData={sidebarData} />
            {outlet ||
                (noBudgets ? (
                    <EmptyContent>
                        You don&apos;t seem to have any budgets. Create one!
                    </EmptyContent>
                ) : (
                    <EmptyContent>
                        Select a budget from the sidebar!
                    </EmptyContent>
                ))}
        </div>
    )
}
