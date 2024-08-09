import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/node'
import { json, useFetcher, useLoaderData } from '@remix-run/react'
import { createClient } from '~/supabase/server'

export async function loader({ request }: LoaderFunctionArgs) {
    const { supabase, headers } = await createClient(request)
    const { data } = await supabase.auth.getUser()
    return json({ user: data.user }, { headers })
}

export const meta: MetaFunction = () => {
    return [{ title: 'Dollars' }, { name: 'description', content: 'Homepage' }]
}

export default function Index() {
    const { user } = useLoaderData<typeof loader>()
    const fetcher = useFetcher()

    return (
        <div className="">
            default page {user?.email}
            <fetcher.Form action="/signout">
                <button type="submit">Sign out</button>
            </fetcher.Form>
        </div>
    )
}
