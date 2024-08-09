import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { Form, json, redirect, useActionData } from '@remix-run/react'
import prisma from '~/prisma/client'
import { protectRouteAgainstAuthUsers } from '~/supabase/routeProtect'
import { createClient } from '~/supabase/server'

export async function loader({ request }: LoaderFunctionArgs) {
    return await protectRouteAgainstAuthUsers(request)
}

export async function action({ request }: ActionFunctionArgs) {
    const signUpData = await request.formData()

    const { supabase, headers } = await createClient(request)

    const {
        data: { user },
        error,
    } = await supabase.auth.signUp({
        email: signUpData.get('email') as string,
        password: signUpData.get('password') as string,
    })

    console.assert(!error, error)
    if (error || !user) {
        return json({ error })
    }

    await prisma.user.create({
        data: {
            username:
                (signUpData.get('username') as string) ?? 'NEED TO IMPLEMENT',
            id: user.id,
        },
    })

    return redirect('/', { headers })
}

export default function SignUp() {
    // only will get a response if it is an error
    const response = useActionData<typeof action>()
    const status = () => {
        if (response) {
            console.log(response.error)
            return 'sign up failure'
        }
    }

    return (
        <div>
            <Form method="post">
                {status()}
                <p>
                    <label>
                        Email
                        <input aria-label="Email" name="email" type="text" />
                    </label>

                    <label>
                        Password
                        <input
                            aria-label="Password"
                            name="password"
                            type="password"
                        />
                    </label>
                </p>
                <button type="submit">Sign up</button>
            </Form>
        </div>
    )
}
