import { ActionFunctionArgs, redirect } from '@remix-run/node'
import prisma from '~/prisma/client'
import authenticateUser from '~/utils/authenticateUser'

export async function action({ request }: ActionFunctionArgs) {
    try {
        const { user } = await authenticateUser(request)

        const budget = await prisma.budget.create({
            data: {
                name: 'My Budget',
                description: 'A budget to save money.',
                userId: user.id,
                freeCash: 100,
                totalCash: 100,
            },
        })
        return redirect(`/budget/${budget.id}`)
    } catch (e) {
        console.log(e)
    }
    const data = await request.formData()
    // parse
    return { x: 'bunga' }
}
