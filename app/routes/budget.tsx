import { Budget, Account } from '@prisma/client'
import { json, LoaderFunctionArgs } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import { isAuthApiError } from '@supabase/supabase-js'
import Sidebar from '~/components/sidebar/Sidebar'
import ServerErrorResponse from '~/error'
import prisma from '~/prisma/client'
import authenticateUser from '~/utils/authenticateUser'

export async function loader({ request }: LoaderFunctionArgs) {
    try {
        const { user } = await authenticateUser(request)

        const budgets = await prisma.budget.findMany({
            where: {
                userId: user.id,
            },
        })

        return json({ budgets })
    } catch (e) {
        if (isAuthApiError(e)) {
            throw new ServerErrorResponse(e)
        } else {
            throw new ServerErrorResponse()
        }
    }
}

export default function View() {
    const { budgets } = useLoaderData<typeof loader>()
    return (
        <div className="flex h-full">
            <Sidebar budgets={budgets as unknown as Budget[]} />
            <Outlet />
        </div>
    )
}
