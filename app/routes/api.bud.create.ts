import { ActionFunctionArgs, redirect } from '@remix-run/node'
import ServerError from '~/error'
import prisma from '~/prisma/client'
import authenticateUser from '~/utils/authenticateUser'

export async function action({ request }: ActionFunctionArgs) {
    try {
        const { user } = await authenticateUser(request)

        const budget = await prisma.budget.create({
            data: {
                name: 'Budget for ' + user.email, // maybe a name based on username
                description: 'A budget to save money.', // maybe a description based on the time/month
                userId: user.id,
            },
        })
        return redirect(`/budget/${budget.id}`)
    } catch (e) {
        // regardless of if it's an auth api error or not found error, just say bad request!
        throw new ServerError({
            message: 'Budget not able to be created.',
            status: 404,
        })
    }
}
