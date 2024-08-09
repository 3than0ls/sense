import { redirect } from '@remix-run/react'
import { createClient } from './server'

/**
 * Redirects an authorized user back to `request.url`, intended for route protection.
 * Example: authorized users shouldn't be able to see the /signin page
 *
 * @param request Request with URL
 */
export async function protectRouteAgainstAuthUsers(request: Request) {
    const { supabase } = await createClient(request)
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (user) {
        return redirect('/')
    }
    return null
}

/**
 * Redirects an unauthorized user back to `request.url`, intended for route protection.
 * Example: unauthorized users shouldn't be able to navigate to /signout, or other authorized pages.
 *
 * @param supabase Supabase server client
 * @param request Request with URL
 */
export async function protectRouteAgainstNoAuthUsers(request: Request) {
    const { supabase } = await createClient(request)
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/')
    }
    return null
}
