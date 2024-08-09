import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
} from '@remix-run/react'
import type { ActionFunctionArgs } from '@remix-run/node'
import './tailwind.css'
import ThemeProvider from './context/ThemeContext'
import { createClient } from './supabase/server'
import { Theme } from '@prisma/client'
import AuthProvider from './context/AuthContext'
import SupabaseProvider from './context/SupabaseContext'

export async function loader({ request }: ActionFunctionArgs) {
    const { supabase } = await createClient(request)
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser()

    let theme = Theme.DARK

    // This may seem redundant to say, but all variables in Auth are used in the AuthContext, and all variables in theme are used in ThemeContext
    // we need to pass env variables from loader because creating a client supabase client with remixjs needs them
    // see: https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=remix&queryGroups=environment&environment=remix-component#create-a-client
    // I prefer how NextJS can expose env variables by prefixing with NEXT_PUBLIC_, but I guess this still works.

    return {
        auth: {
            env: {
                SUPABASE_URL: process.env.SUPABASE_URL!,
                SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
            },
            user,
        },
        theme: {
            theme,
        },
    }
}

export function Layout({ children }: { children: React.ReactNode }) {
    const {
        auth: { env, user },
        theme: { theme },
    } = useLoaderData<typeof loader>()

    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <Meta />
                <Links />
            </head>
            <body>
                <SupabaseProvider env={env}>
                    <AuthProvider initialUser={user}>{children}</AuthProvider>
                </SupabaseProvider>
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    )
}

export default function App() {
    return <Outlet />
}
