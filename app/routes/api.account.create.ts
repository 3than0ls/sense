import { ActionFunctionArgs, redirect } from '@remix-run/node'
import ServerErrorResponse from '~/error'
import prisma from '~/prisma/client'
import authenticateUser from '~/utils/authenticateUser'
import { createAccountSchema } from '~/zodSchemas/account'

export async function action({ request }: ActionFunctionArgs) {
    try {
        const data = await request.formData()
        const newAccount = createAccountSchema.parse(Object.fromEntries(data))

        const { user } = await authenticateUser(request)

        const budget = await prisma.budget.findFirstOrThrow({
            where: {
                id: newAccount.budgetId,
                userId: user.id,
            },
        })

        const account = await prisma.account.create({
            data: {
                name: newAccount.name,
                initialBalance: newAccount.initialBalance,
                budgetId: budget.id,
            },
        })

        return redirect(`/account/${account.id}`)
    } catch (e) {
        // regardless of if it's an auth api error or not found error, just say bad request!
        throw new ServerErrorResponse({
            message: 'Account not able to be created.',
            status: 404,
        })
    }
}
