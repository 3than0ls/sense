import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/node'
import { json, useLoaderData } from '@remix-run/react'
import Landing from '~/components/landing/Landing'
import getUserData from '~/prisma/userData'
import { createClient } from '~/supabase/server'

export async function loader({ request }: LoaderFunctionArgs) {
    const { supabase, headers } = await createClient(request)
    const { data } = await supabase.auth.getUser()

    let userData = null
    if (data.user !== null) {
        userData = await getUserData({ userId: data.user.id })
    }

    return json(userData, { headers })
}

export const meta: MetaFunction = () => {
    return [{ title: 'Dollars' }, { name: 'description', content: 'Homepage' }]
}

export default function Index() {
    const userData = useLoaderData<typeof loader>()
    return <Landing userData={userData} />
}
