import { Account, Budget } from '@prisma/client'
import { LoaderFunctionArgs } from '@remix-run/node'
import { json, Outlet, useLoaderData } from '@remix-run/react'
import { isAuthApiError } from '@supabase/supabase-js'
import Sidebar from '~/components/sidebar/Sidebar'
import ServerErrorResponse from '~/error'
import prisma from '~/prisma/client'
import authenticateUser from '~/utils/authenticateUser'

export async function loader({ request }: LoaderFunctionArgs) {
    // the same loader as budget.tsx because both use Sidebar
    try {
        const { user } = await authenticateUser(request)

        const budgets = await prisma.budget.findMany({
            where: {
                userId: user.id,
            },
            include: {
                accounts: true,
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
            <Sidebar
                budgets={
                    budgets as unknown as (Budget & {
                        accounts: Account[]
                    })[]
                }
            />

            <Outlet />
        </div>
    )
}
