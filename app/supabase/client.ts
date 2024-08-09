import { createBrowserClient } from '@supabase/ssr'

export default function createClient(env: {
    SUPABASE_URL: string
    SUPABASE_ANON_KEY: string
}) {
    return createBrowserClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
}

// https://stackoverflow.com/questions/76103394/supabase-auth-and-remix
