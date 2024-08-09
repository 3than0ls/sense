import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/node'
import {
    json,
    useFetcher,
    useLoaderData,
    useRevalidator,
} from '@remix-run/react'
import { useEffect } from 'react'
import { useAuth } from '~/context/AuthContext'
import { useSupabase } from '~/context/SupabaseContext'
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
    const revalidator = useRevalidator()

    const supabase = useSupabase()
    const signOut = async () => {
        await supabase.auth.signOut()
        revalidator.revalidate()
    }

    return (
        <div className="">
            default page {user?.email}
            <button className="m-4" onClick={signOut}>
                Sign out
            </button>
        </div>
    )
}
