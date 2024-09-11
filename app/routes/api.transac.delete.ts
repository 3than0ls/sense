import { ActionFunctionArgs, json } from '@remix-run/node'
import { z } from 'zod'
import ServerErrorResponse from '~/error'
import prisma from '~/prisma/client'
import authenticateUser from '~/utils/authenticateUser'

const uuid = z.string().uuid()

export async function action({ request }: ActionFunctionArgs) {
    try {
        const data = await request.formData()
        const transacId = uuid.parse(data.get('transactionId'))

        const { user } = await authenticateUser(request)

        const deletedTransaction = await prisma.transaction.delete({
            where: {
                id: transacId,
                account: {
                    budget: {
                        userId: user.id,
                    },
                },
            },
        })

        return json(deletedTransaction)
    } catch (e) {
        throw new ServerErrorResponse({
            message: 'Transaction unable to be deleted.',
            status: 400,
        })
    }
}
