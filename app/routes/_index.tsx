import type {
    MetaFunction,
    LoaderFunctionArgs,
    ActionFunctionArgs,
} from '@remix-run/node'
import { json, Link, useLoaderData, useRevalidator } from '@remix-run/react'
import { z } from 'zod'
import Input from '~/components/form/Input'
import RemixForm from '~/components/RemixForm'
import { useSupabase } from '~/context/SupabaseContext'
import useRemixForm from '~/hooks/useRemixForm'
import { createClient } from '~/supabase/server'

export async function loader({ request }: LoaderFunctionArgs) {
    const { supabase, headers } = await createClient(request)
    const { data } = await supabase.auth.getUser()
    return json({ user: data.user }, { headers })
}

const schema = z.object({
    test: z.string().min(5, 'test >= 5'),
})
type FormValues = z.infer<typeof schema>

export async function action({ request }: ActionFunctionArgs) {
    const data = await request.formData()
    console.log('received on server', data)
    return {}
}

export const meta: MetaFunction = () => {
    return [{ title: 'Dollars' }, { name: 'description', content: 'Homepage' }]
}

export default function Index() {
    const { user } = useLoaderData<typeof loader>()
    const revalidator = useRevalidator()

    const supabase = useSupabase()
    const signOut = async () => {
        await supabase.auth.signOut()
        revalidator.revalidate()
    }

    const userOptions = user ? (
        <>
            <span>Welcome user {user.email}</span>
            <button className="m-4" onClick={signOut}>
                Sign out
            </button>
        </>
    ) : (
        <>
            <Link to="/signin">Sign in</Link>
            <Link to="/signup">Sign up</Link>
        </>
    )

    const { methods, fetcher } = useRemixForm<FormValues>(schema)
    return (
        <div className="">
            <div className="flex gap-6 border-black border-4 p-2">
                {userOptions}
            </div>
            <RemixForm
                methods={methods}
                fetcher={fetcher}
                className="w-80 bg-gray-400"
            >
                <Input name="test your api endpoint" />
                <button type="submit">submit</button>
            </RemixForm>
            <Link to="/budget" className="bg-gray-300">
                preview budget skeleton
            </Link>
        </div>
    )
}
