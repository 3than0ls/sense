import type { LoaderFunctionArgs } from '@remix-run/node'
import { useRevalidator } from '@remix-run/react'
import { useForm } from 'react-hook-form'
import { useSupabase } from '~/context/SupabaseContext'
import { protectRouteAgainstAuthUsers } from '~/supabase/routeProtect'

export async function loader({ request }: LoaderFunctionArgs) {
    return await protectRouteAgainstAuthUsers(request)
}

type SignInFormData = {
    email: string
    password: string
}

// https://www.freecodecamp.org/news/react-form-validation-zod-react-hook-form/ look into zod later
export default function SignIn() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<SignInFormData>()
    const revalidator = useRevalidator()
    const supabase = useSupabase()

    const signIn = async (data: SignInFormData) => {
        const { error } = await supabase.auth.signInWithPassword(data)
        // TODO: server error handling
        revalidator.revalidate()
    }

    return (
        <div>
            <form onSubmit={handleSubmit(async (d) => await signIn(d))}>
                <p>
                    <label>
                        Email
                        <input
                            {...register('email')}
                            aria-label="Email"
                            name="email"
                            type="email"
                            required
                        />
                    </label>

                    <label>
                        Password
                        <input
                            {...register('password')}
                            aria-label="Password"
                            name="password"
                            type="password"
                            required
                        />
                    </label>
                </p>
                <button type="submit">Sign In</button>
            </form>
        </div>
    )
}
