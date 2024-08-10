import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/node'
import { json, useLoaderData, useRevalidator } from '@remix-run/react'
import { z } from 'zod'
import Input from '~/components/form/Input'
import { useSupabase } from '~/context/SupabaseContext'
import useRemixForm from '~/hooks/remix-form-hook'
import { createClient } from '~/supabase/server'

export async function loader({ request }: LoaderFunctionArgs) {
    const { supabase, headers } = await createClient(request)
    const { data } = await supabase.auth.getUser()
    return json({ user: data.user }, { headers })
}

export async function action() {
    console.log('received')
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

    const schema = z.object({
        test: z.string().min(1, 'test cannot be empty'),
    })
    type FormValues = z.infer<typeof schema>

    const { methods, RemixForm } = useRemixForm<FormValues>(schema)

    const onSubmit = (data: FormValues) => {
        console.log('form submit data', data)
        methods.setError('test', { type: 'custom', message: 'you did bad >:(' })
    }

    return (
        <div className="">
            default page {user?.email}
            <button className="m-4" onClick={signOut}>
                Sign out
            </button>
            <RemixForm className="w-80 bg-gray-400" onSubmit={onSubmit}>
                <Input name="test" />
                <button type="submit">submit</button>
            </RemixForm>
        </div>
    )
}
