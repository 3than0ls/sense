import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/react'
import { AuthApiError } from '@supabase/supabase-js'
import { useEffect } from 'react'
import { z, ZodError } from 'zod'
import Input from '~/components/form/Input'
import RemixForm from '~/components/RemixForm'
import { ActionErrorType } from '~/error'
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
    try {
        const formData = await request.formData()
        // must always convert FormData to object for zod schema parsing
        const data = Object.fromEntries(formData)
        const parsed = schema.parse(data)

        const { supabase, headers } = await createClient(request)
        const {
            data: { user },
            error,
        } = await supabase.auth.signUp({
            email: parsed.email,
            password: parsed.password,
        })
        if (error) {
            throw error
        }

        await prisma.user.create({
            data: {
                username: parsed.email + '_username_to_be_implenteed',
                id: user!.id,
            },
        })
        return redirect('/', { headers })
    } catch (e) {
        let returnError: ActionErrorType
        if (e instanceof ZodError) {
            // frankly- the only people who have gotten to this error point don't deserve a descriptive nor graceful error handling
            returnError = {
                message: e.errors[0].message,
                code: 'zod_parse_error',
                status: 400,
            }
        } else if (e instanceof AuthApiError) {
            returnError = {
                message: e.message,
                code: e.code ?? 'unknown_supabase_auth_api_error',
                status: 422,
            }
        } else {
            console.log('Unexpected server error:')
            throw e
        }
        return json(returnError, { status: returnError.status })
    }
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
