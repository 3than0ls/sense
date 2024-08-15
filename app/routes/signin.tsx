import type { LoaderFunctionArgs } from '@remix-run/node'
import { Link, useRevalidator } from '@remix-run/react'
import { z } from 'zod'
import Background from '~/components/Background'
import Input from '~/components/form/Input'
import Submit from '~/components/form/Submit'
import RemixForm from '~/components/RemixForm'
import { useSupabase } from '~/context/SupabaseContext'
import useRemixForm from '~/hooks/useRemixForm'
import { protectRouteAgainstAuthUsers } from '~/supabase/routeProtect'

export async function loader({ request }: LoaderFunctionArgs) {
    return await protectRouteAgainstAuthUsers(request)
}

const schema = z.object({
    email: z.string().email(),
    password: z.string(),
})
type SignInFormData = z.infer<typeof schema>

export default function SignIn() {
    const revalidator = useRevalidator()

    const { fetcher, methods } = useRemixForm<SignInFormData>(schema)

    // const methods = useForm({
    //     resolver: zodResolver(schema),
    // })

    const supabase = useSupabase()
    const signIn = async (data: SignInFormData) => {
        const { error } = await supabase.auth.signInWithPassword(data)
        if (error) {
            methods.setError('email', { message: error.message })
            methods.setError('password', { message: error.message })
        } else {
            revalidator.revalidate()
        }
    }

    console.log('rerender')
    return (
        <Background>
            <RemixForm
                className="px-8 lg:px-20 py-10  h-full flex flex-col gap-5 relative"
                fetcher={fetcher}
                methods={methods}
                onSubmit={signIn}
                noAction
            >
                <h1 className="text-6xl font-work-black w-[450px]">
                    Good to see you again.
                </h1>
                <div className="w-full max-h-[500px] flex-grow flex flex-col justify-center">
                    <Input label="Email Address" name="email" type="email" />
                    <Input label="Password" name="password" type="password" />
                    <div className="flex justify-center mt-4">
                        <Submit>Sign in</Submit>
                    </div>
                </div>
                <div className="absolute bottom-0 mb-2 w-full px-20 self-center flex flex-col justify-center gap-2">
                    <hr className="h-[2px] bg-black" />
                    <span className="text-subtle text-center">
                        Don&apos;t have an account?{' '}
                        <Link to="/signup" className="underline">
                            Sign up.
                        </Link>
                    </span>
                </div>
            </RemixForm>
        </Background>
    )
}
