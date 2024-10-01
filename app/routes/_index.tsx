import { User } from '@prisma/client'
import type {
    MetaFunction,
    LoaderFunctionArgs,
    ActionFunctionArgs,
} from '@remix-run/node'
import { json, Link, useLoaderData, useRevalidator } from '@remix-run/react'
import { z } from 'zod'
import Landing from '~/components/landing/Landing'
import { useSupabase } from '~/context/SupabaseContext'
import prisma from '~/prisma/client'
import { ReplaceDatesWithStrings } from '~/prisma/fullBudgetData'
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
    const revalidator = useRevalidator()

    const supabase = useSupabase()
    const signOut = async () => {
        await supabase.auth.signOut()
        revalidator.revalidate()
    }

    return <Landing userData={userData} />
}
