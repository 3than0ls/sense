import type { LoaderFunctionArgs } from '@remix-run/node'
import { useRevalidator } from '@remix-run/react'
import { z } from 'zod'
import Input from '~/components/form/Input'
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
        <RemixForm
            className="w-80 bg-gray-500"
            fetcher={fetcher}
            methods={methods}
            onSubmit={signIn}
            noAction
        >
            <div>
                <Input name="email" type="email" />
                <Input name="password" type="password" />
            </div>
            <button type="submit">Sign In</button>
        </RemixForm>
    )
}
