import { ActionFunctionArgs, json } from '@remix-run/node'
import ServerErrorResponse from '~/error'
import prisma from '~/prisma/client'
import authenticateUser from '~/utils/authenticateUser'
import { transactionSchema } from '~/zodSchemas/transaction'

export async function action({ request }: ActionFunctionArgs) {
    try {
        const data = await request.formData()
        const newTransac = transactionSchema.parse(Object.fromEntries(data))

        await authenticateUser(request)

        const transaction = await prisma.transaction.create({
            data: {
                amount: newTransac.amount,
                description: newTransac.description,
                accountId: newTransac.accountId,
                budgetItemId: newTransac.budgetItemId,
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
