import { ActionFunctionArgs, redirect } from '@remix-run/node'
import ServerError from '~/error'
import prisma from '~/prisma/client'
import authenticateUser from '~/utils/authenticateUser'
import { accountSchema } from '~/zodSchemas/account'

export async function action({ request }: ActionFunctionArgs) {
    try {
        const data = await request.formData()
        const newAccount = accountSchema.parse(Object.fromEntries(data))

        const { user } = await authenticateUser(request)

        const account = await prisma.account.create({
            data: {
                name: newAccount.name,
                initialBalance: newAccount.initialBalance,
                budgetId: newAccount.budgetId,
                userId: user.id,
            },
        })
        return redirect(`/account/${account.id}`)
    } catch (e) {
        // regardless of if it's an auth api error or not found error, just say bad request!
        throw new ServerError({
            message: 'Account not able to be created.',
            status: 404,
        })
    }
}
