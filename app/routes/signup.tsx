import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { json, Link, redirect } from '@remix-run/react'
import { AuthApiError } from '@supabase/supabase-js'
import { useEffect } from 'react'
import { z, ZodError } from 'zod'
import Background from '~/components/Background'
import Input from '~/components/form/Input'
import Submit from '~/components/form/Submit'
import RemixForm from '~/components/RemixForm'
import useRemixForm, { ActionReturnType } from '~/hooks/useRemixForm'
import prisma from '~/prisma/client'
import { protectRouteAgainstAuthUsers } from '~/supabase/routeProtect'
import { createClient } from '~/supabase/server'

export async function loader({ request }: LoaderFunctionArgs) {
    return await protectRouteAgainstAuthUsers(request)
}

const schema = z.object({
    firstName: z
        .string()
        .min(1, { message: 'First name is required' })
        .max(25, { message: 'First name must be less than 25 characters' }),
    lastName: z
        .string()
        .min(1, { message: 'Last name is required' })
        .max(25, { message: 'Last name must be less than 25 characters' }),
    email: z.string().email().min(1, { message: 'Last name is required' }),
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
        // if prisma user creation errors (usually due to unsynced schemas), the auth user is created but not the public
        await prisma.user.create({
            data: {
                email: parsed.email,
                firstName: parsed.firstName,
                lastName: parsed.lastName,
                id: user!.id,
            },
        })
        return redirect('/', { headers })
    } catch (e) {
        // this error handling was extremely poorly written but not worth trying to repair- DO NOT USE AS A EXAMPLE
        let returnError
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
            console.error('Unexpected server error:')
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
        <Background>
            <RemixForm
                className="px-8 lg:px-20 py-10  h-full flex flex-col gap-5 relative"
                fetcher={fetcher}
                methods={methods}
            >
                <h1 className="text-6xl font-work-black w-[450px]">
                    Stack money today.
                </h1>
                <div className="w-full max-h-[500px] flex-grow flex flex-col justify-center">
                    <Input label="First Name" name="firstName" type="text" />
                    <Input label="Last Name" name="lastName" type="text" />
                    <Input label="Email Address" name="email" type="email" />
                    <Input label="Password" name="password" type="password" />
                    <div className="flex justify-center mt-4">
                        <Submit className="py-3 px-12 rounded-2xl">
                            Sign up
                        </Submit>
                    </div>
                </div>
                <div className="absolute bottom-0 mb-2 w-full px-20 self-center flex flex-col justify-center gap-2">
                    <hr className="h-[2px] bg-black" />
                    <span className="text-subtle text-center">
                        Already have an account?{' '}
                        <Link to="/signin" className="underline">
                            Log in.
                        </Link>
                    </span>
                </div>
            </RemixForm>
        </Background>
    )
}
