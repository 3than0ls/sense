import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { Form, json, redirect, useActionData } from '@remix-run/react'
import { AuthError } from '@supabase/supabase-js'
import { useEffect } from 'react'
import { z } from 'zod'
import Input from '~/components/form/Input'
import RemixForm from '~/components/RemixForm'
import useRemixForm, { ActionReturnType } from '~/hooks/useRemixForm'
import prisma from '~/prisma/client'
import { protectRouteAgainstAuthUsers } from '~/supabase/routeProtect'
import { createClient } from '~/supabase/server'

export async function loader({ request }: LoaderFunctionArgs) {
    return await protectRouteAgainstAuthUsers(request)
}

const schema = z.object({
    email: z.string().email(),
    password: z
        .string()
        .min(6, { message: 'Password must be at least 6 characters' }),
})
type SignUpFormData = z.infer<typeof schema>

// Sign up, as opposed to sign in, requires an action because prisma needs to create a User model along with the supabase auth user being created
export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData()
    // must always convert FormData to object for zod schema parsing
    const data = Object.fromEntries(formData)
    const parsed = schema.safeParse(data)
    if (parsed.error) {
        return json(
            { message: 'Invalid form data.', code: 'zod_parse_fail' },
            { status: 400 }
        )
    }

    const { supabase, headers } = await createClient(request)
    const {
        data: { user },
        error,
    } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
    }) // MAY cause issues, as this does not trigger an auth state change. maybe not tho!
    if (error) {
        return json(
            {
                message: error.message ?? 'Authorization Error',
                code: error.code,
            },
            { status: error.status ?? 422 }
        )
    }

    await prisma.user.create({
        data: {
            username: parsed.data.email + '_username_to_be_implenteed',
            id: user!.id,
        },
    })
    return redirect('/', { headers })
}

export default function SignUp() {
    const { fetcher, methods } = useRemixForm<SignUpFormData>(schema)

    useEffect(() => {
        // https://github.com/remix-run/react-router/discussions/10686 (DON'T USE useActionData when using fetcher)
        const serverError = fetcher.data as ActionReturnType<typeof action>
        // only will get a response if it is an error, but if check anyway
        if (serverError) {
            const { message, code } = serverError
            if (code === 'user_already_exists') {
                methods.setError('email', { message })
            } else {
                methods.setError('email', { message })
                methods.setError('password', { message })
            }
        }
    }, [fetcher.data, methods])
    // if (serverError.) {

    // }

    return (
        <RemixForm
            className="w-80 bg-blue-500"
            fetcher={fetcher}
            methods={methods}
        >
            <div>
                <Input name="email" type="email" />
                <Input name="password" type="password" />
            </div>
            <button type="submit">Sign Up</button>
        </RemixForm>
    )
}
