import { ActionFunctionArgs, json } from '@remix-run/node'
import ServerErrorResponse from '~/error'
import prisma from '~/prisma/client'
import authenticateUser from '~/utils/authenticateUser'
import { updateTransactionSchema } from '~/zodSchemas/transaction'

export async function action({ request }: ActionFunctionArgs) {
    try {
        const data = await request.formData()
        const updateTransac = updateTransactionSchema.parse(
            Object.fromEntries(data)
        )

        const { user } = await authenticateUser(request)

        const transaction = await prisma.transaction.update({
            where: {
                id: updateTransac.transactionId,
                budgetItem: {
                    budget: {
                        userId: user.id,
                    },
                },
            },
            data: {
                accountId: updateTransac.accountId, // debate whether or not updating originating account should be allowed
                amount: updateTransac.amount,
                description: updateTransac.description,
                budgetItemId: updateTransac.budgetItemId,
            },
        })

        return json(transaction)
    } catch (e) {
        throw new ServerErrorResponse({
            message: 'Transaction not able to be created.',
            status: 400,
        })
    }
}
