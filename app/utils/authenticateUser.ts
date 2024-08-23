import { createClient } from '~/supabase/server'

/**
 *  Authenticates the user, returning the authenticated supabase auth user.
 *  If error, throws an AuthApiError, that must be handled.
 *
 *  Just a function to remove a few lines of code. Nothing new is happening here.
 */
export default async function authenticateUser(request: Request) {
    const { supabase, headers } = await createClient(request)
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser()
    if (error) {
        throw error
    }

    return { supabase, headers, user: user! }
}
