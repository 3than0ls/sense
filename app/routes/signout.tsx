import { createClient } from '~/supabase/server'
import { redirect, type ActionFunctionArgs } from '@remix-run/node'

export async function loader({ request }: ActionFunctionArgs) {
    const { supabase } = await createClient(request)
    const { error } = await supabase.auth.signOut()

    console.assert(!error, error)

    return redirect('/')
}
