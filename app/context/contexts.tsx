import React from 'react'
import AuthProvider from './AuthContext'
import SupabaseProvider from './SupabaseContext'
import ThemeProvider from './ThemeContext'
import { User } from '@supabase/supabase-js'
import { Theme } from '~/prisma/theme'

export type ContextsProviderProps = {
    supabase: {
        env: {
            SUPABASE_URL: string
            SUPABASE_ANON_KEY: string
        }
    }
    auth: {
        initialUser: User | null
    }
    theme: {
        initialTheme: Theme
    }
    children: React.ReactNode
}

const ContextsProvider = ({
    supabase: { env },
    auth: { initialUser },
    theme: { initialTheme },
    children,
}: ContextsProviderProps) => {
    return (
        <SupabaseProvider env={env}>
            <AuthProvider initialUser={initialUser}>
                <ThemeProvider initialTheme={initialTheme}>
                    {children}
                </ThemeProvider>
            </AuthProvider>
        </SupabaseProvider>
    )
}

export default ContextsProvider
