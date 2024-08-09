import React, { useContext, createContext, useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { useSupabase } from './SupabaseContext'

type AuthProviderProps = {
    initialUser: User | null
    children: React.ReactNode
}

type AuthContextType = {
    user: User | null
}

const AuthContext = createContext<AuthContextType>({
    user: null,
})

const AuthProvider = ({ initialUser, children }: AuthProviderProps) => {
    const supabase = useSupabase()

    const [user, setUser] = useState<User | null>(initialUser)

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                // console.log('auth state changed!', session?.user ?? null)
                setUser(session?.user ?? null)
            }
        )
        return () => {
            authListener.subscription.unsubscribe()
        }
    }, [supabase.auth])

    return (
        <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
    )
}

export const useAuth = (): AuthContextType => {
    return useContext(AuthContext)
}

export default AuthProvider
