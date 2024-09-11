import { ActionFunctionArgs, json } from '@remix-run/node'
import { z } from 'zod'
import ServerErrorResponse from '~/error'
import prisma from '~/prisma/client'
import authenticateUser from '~/utils/authenticateUser'

const uuid = z.string().uuid()

export async function action({ request }: ActionFunctionArgs) {
    try {
        const data = await request.formData()
        const accountId = uuid.parse(data.get('accountId'))

        const { user } = await authenticateUser(request)

        const deletedAccount = await prisma.account.delete({
            where: {
                id: accountId,
                budget: { userId: user.id },
            },
        })

        return json(deletedAccount)
    } catch (e) {
        throw new ServerErrorResponse({
            message: 'Account unable to be deleted.',
            status: 400,
        })
    }
}
