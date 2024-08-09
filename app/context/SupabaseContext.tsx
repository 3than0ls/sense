import React, { useContext, createContext, useState } from 'react'
import { SupabaseClient } from '@supabase/supabase-js'
import createClient from '~/supabase/client'

export type SupabaseProviderProps = {
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
