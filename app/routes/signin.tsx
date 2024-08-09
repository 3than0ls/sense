import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { Form, json, redirect, useActionData } from '@remix-run/react'
import { protectRouteAgainstAuthUsers } from '~/supabase/routeProtect'
import { createClient } from '~/supabase/server'

export async function loader({ request }: LoaderFunctionArgs) {
    return await protectRouteAgainstAuthUsers(request)
}

export async function action({ request }: ActionFunctionArgs) {
    const signInData = await request.formData()
    const { supabase, headers } = await createClient(request)

    const { error } = await supabase.auth.signInWithPassword({
        email: signInData.get('email') as string,
        password: signInData.get('password') as string,
    })

    console.assert(!error, error)

    if (error) {
        return json({ error })
    } else {
        return redirect('/', { headers })
    }
}

export default function SignUp() {
    const response = useActionData<typeof action>()

    const status = () => {
        if (response === undefined) {
            return '?'
        }
        if (response.error) {
            console.log(response.error)
            return 'bad signin'
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
                <button type="submit">Sign In</button>
            </Form>
        </div>
    )
}
