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
import { createClient } from './supabase/server'
import { Theme } from '@prisma/client'
import prisma from './prisma/client'
import ContextsProvider from './context/contexts'

export async function loader({ request }: ActionFunctionArgs) {
    const { supabase } = await createClient(request)
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // TODO: store theme in local storage for users that don't have an account, but still change theme
    let initialTheme: Theme = Theme.LIGHT
    if (user) {
        const userData = await prisma.user.findFirst({
            where: { id: user.id },
        })
        initialTheme = userData?.theme ?? Theme.DARK
    }

    return {
        supabase: {
            env: {
                // must pass process env variable thru loader because remix doesn't have browser accessible env vars like NodeJS
                SUPABASE_URL: process.env.SUPABASE_URL!,
                SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
            },
        },
        auth: {
            initialUser: user,
        },
        theme: {
            initialTheme: initialTheme,
        },
    }
}

export function Layout({ children }: { children: React.ReactNode }) {
    const {
        supabase: { env },
        auth: { initialUser },
        theme: { initialTheme },
    } = useLoaderData<typeof loader>()

    const basicTheme =
        initialTheme === 'LIGHT' ? 'bg-light text-light' : 'bg-dark text-dark'

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
            <body className={basicTheme}>
                <ContextsProvider
                    supabase={{ env }}
                    auth={{ initialUser }}
                    theme={{ initialTheme }}
                >
                    {children}
                </ContextsProvider>
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    )
}

export default function App() {
    return <Outlet />
}
