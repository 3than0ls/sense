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

        const sign = newTransac.transactionFlow === 'inflow' ? 1 : -1

        const transaction = await prisma.transaction.create({
            data: {
                amount: newTransac.amount * sign,
                description: newTransac.description,
                accountId: newTransac.accountId,
                // schema states budgetItemId must be a string,
                // thus free cash is indicated by an empty string and must be set to undefined
                budgetItemId: newTransac.budgetItemId || undefined,
            },
        })

        return json(transaction)
    } catch (e) {
        console.log(e)
        throw new ServerErrorResponse({
            message: 'Transaction not able to be created.',
            status: 400,
        })
    }
}
