import { json, LoaderFunctionArgs } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import { isAuthApiError } from '@supabase/supabase-js'
import Sidebar from '~/components/sidebar/Sidebar'
import ServerErrorResponse from '~/error'
import getSidebarData from '~/prisma/sidebarData'
import authenticateUser from '~/utils/authenticateUser'

export async function loader({ request }: LoaderFunctionArgs) {
    try {
        const { user } = await authenticateUser(request)

        const sidebarData = await getSidebarData({ userId: user.id })

        return json(sidebarData)
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

    // json doesn't have Date type, and so when sent via loader, Date is converted to String, causing type mismatches
    // thus the sidebarData as never, and a few other type castings seen throughout codebase
    return (
        <div className="flex h-full">
            <Sidebar sidebarData={sidebarData as never} />
            <Outlet />
        </div>
    )
}
