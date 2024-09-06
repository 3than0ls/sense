import { ActionFunctionArgs, json } from '@remix-run/node'
import ServerError from '~/error'
import prisma from '~/prisma/client'
import authenticateUser from '~/utils/authenticateUser'
import { transactionSchema } from '~/zodSchemas/transaction'

export async function action({ request }: ActionFunctionArgs) {
    try {
        const data = await request.formData()
        const newTransac = transactionSchema.parse(Object.fromEntries(data))

        const { user } = await authenticateUser(request)

        const budgetItem = await prisma.budgetItem.findFirstOrThrow({
            where: {
                id: newTransac.budgetItemId,
                budget: {
                    userId: user.id,
                },
            },
        })

        const account = await prisma.account.findFirstOrThrow({
            where: {
                id: newTransac.accountId,
            },
        })

        const transaction = await prisma.transaction.create({
            data: {
                amount: newTransac.amount,
                description: newTransac.description,
                accountId: account.id,
                budgetItemId: budgetItem.id,
            },
        })

        return json(transaction)
    } catch (e) {
        throw new ServerError({
            message: 'Transaction not able to be created.',
            status: 400,
        })
    }
}
