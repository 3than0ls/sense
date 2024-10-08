import {
    isRouteErrorResponse,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
    useRouteError,
} from '@remix-run/react'
import type { ActionFunctionArgs } from '@remix-run/node'
import '~/tailwind.css'
import { createClient } from './supabase/server'
import prisma from './prisma/client'
import ContextsProvider from './context/contexts'
import ModalProvider from './context/ModalContext'
import LoadingBar from './components/LoadingBar'
import Error from './components/Error'
import { theme, Theme } from './prisma/theme'

export async function loader({ request }: ActionFunctionArgs) {
    const { supabase } = await createClient(request)
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // TODO: store theme in local storage for users that don't have an account, but still change theme
    let initialTheme: Theme = theme.LIGHT
    if (user) {
        const userData = await prisma.user.findFirst({
            where: { id: user.id },
        })
        initialTheme = userData?.theme ?? theme.DARK
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
            <body className="relative h-screen flex flex-col">
                {/* <div className="sticky top-0 h-10 bg-yellow-300">
                    some sort of universal navbar here
                </div> */}
                <div className="min-h-0 h-full">{children}</div>
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    )
}

export function ErrorBoundary() {
    const error = useRouteError()
    if (isRouteErrorResponse(error)) {
        console.error(error.data)
    } else {
        console.error(error)
    }

    return <Error />
}

export default function App() {
    const {
        supabase: { env },
        auth: { initialUser },
        theme: { initialTheme },
    } = useLoaderData<typeof loader>()

    const basicTheme =
        initialTheme === 'LIGHT' ? 'bg-light text-light' : 'bg-dark text-dark'

    return (
        <ContextsProvider
            supabase={{ env }}
            auth={{ initialUser }}
            theme={{ initialTheme }}
        >
            <div className={`relative h-full ${basicTheme}`}>
                <LoadingBar />
                <ModalProvider>
                    <Outlet />
                </ModalProvider>
            </div>
        </ContextsProvider>
    )
}
