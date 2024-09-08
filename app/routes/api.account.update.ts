import { ActionFunctionArgs, json } from '@remix-run/node'
import ServerError from '~/error'
import prisma from '~/prisma/client'
import authenticateUser from '~/utils/authenticateUser'
import { updateAccountSchema } from '~/zodSchemas/account'

export async function action({ request }: ActionFunctionArgs) {
    try {
        const data = await request.formData()
        const { name, initialBalance, budgetId, accountId } =
            updateAccountSchema.parse(Object.fromEntries(data))

        const { user } = await authenticateUser(request)

        const updatedBudget = await prisma.account.update({
            where: {
                id: accountId,
                budget: { userId: user.id },
            },
            data: {
                name,
                initialBalance,
                budgetId,
            },
        })

        return json(updatedBudget)
    } catch (e) {
        throw new ServerError()
    }
}
