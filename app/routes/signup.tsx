import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { Form, redirect, useActionData } from '@remix-run/react'
import prisma from '~/prisma/client'
import { protectRouteAgainstAuthUsers } from '~/supabase/routeProtect'
import { createClient } from '~/supabase/server'

export async function loader({ request }: LoaderFunctionArgs) {
    return await protectRouteAgainstAuthUsers(request)
}

// Sign up, as opposed to sign in, requires an action because prisma needs to create a User model along with the supabase auth user being created
export async function action({ request }: ActionFunctionArgs) {
    const signUpData = await request.formData()
    const { supabase, headers } = await createClient(request)
    const {
        data: { user },
        error,
    } = await supabase.auth.signUp({
        email: signUpData.get('email') as string,
        password: signUpData.get('password') as string,
    }) // MAY cause issues, as this does not trigger an auth state change. maybe not tho!

    if (error) {
        return error
    }

    await prisma.user.create({
        data: {
            username:
                (signUpData.get('username') as string) ?? 'NEED TO IMPLEMENT',
            id: user!.id,
        },
    })
    return redirect('/', { headers })
}

export default function SignUp() {
    // only will get a response if it is an error
    const serverError = useActionData<typeof action>()
    console.assert(!serverError, serverError)

    return (
        <div>
            <Form method="post">
                {serverError && serverError.message}
                <p>
                    <label>
                        Email
                        <input
                            aria-label="Email"
                            name="email"
                            type="email"
                            required
                        />
                    </label>

                    <label>
                        Password
                        <input
                            aria-label="Password"
                            name="password"
                            type="password"
                            required
                        />
                    </label>
                </p>
                <button type="submit">Sign up</button>
            </Form>
        </div>
    )
}
