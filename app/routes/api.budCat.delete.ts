import { ActionFunctionArgs, json } from '@remix-run/node'
import { z } from 'zod'
import ServerErrorResponse from '~/error'
import prisma from '~/prisma/client'
import authenticateUser from '~/utils/authenticateUser'

const uuid = z.string().uuid()

export async function action({ request }: ActionFunctionArgs) {
    try {
        const data = await request.formData()
        const budCatId = uuid.parse(data.get('budgetCategoryId'))

        const { user } = await authenticateUser(request)

        const [budCat] = await prisma.$transaction([
            prisma.budgetCategory.update({
                where: {
                    id: budCatId,
                    budget: {
                        userId: user.id,
                    },
                },
                data: {
                    deleted: true,
                },
            }),
            prisma.budgetItem.updateMany({
                where: {
                    budgetCategoryId: budCatId,
                    budget: {
                        userId: user.id,
                    },
                },
                data: {
                    deleted: true,
                },
            }),
        ])

        return json(budCat)
    } catch (e) {
        throw new ServerErrorResponse()
    }
}
