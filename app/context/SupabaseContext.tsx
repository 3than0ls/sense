import React, { useContext, createContext, useState, useEffect } from 'react'
import { SupabaseClient, User } from '@supabase/supabase-js'
import createClient from '~/supabase/client'

type SupabaseProviderProps = {
    env: {
        SUPABASE_URL: string
        SUPABASE_ANON_KEY: string
    }
    children: React.ReactNode
}

type SupabaseContextType = SupabaseClient | undefined

const SupabaseContext = createContext<SupabaseContextType>(undefined)

const SupabaseProvider = ({ env, children }: SupabaseProviderProps) => {
    const init = createClient(env)

    const [supabase] = useState<SupabaseClient>(init)

    return (
        <SupabaseContext.Provider value={supabase}>
            {children}
        </SupabaseContext.Provider>
    )
}

export const useSupabase = (): SupabaseClient => {
    const supabaseContext = useContext(SupabaseContext)
    if (supabaseContext === undefined) {
        throw new Error(
            'Error: likely accessing Supabase context outside of provider'
        )
    }
    return supabaseContext
}

export default SupabaseProvider

// learned from: https://www.youtube.com/watch?v=05ZM4ymK9Nc
// and https://www.youtube.com/watch?v=hn-c0u2mDIQ
// and then of course, from supabase for the onSupabaseStateChange part
