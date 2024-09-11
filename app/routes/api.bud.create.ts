import { ActionFunctionArgs, redirect } from '@remix-run/node'
import ServerErrorResponse from '~/error'
import prisma from '~/prisma/client'
import authenticateUser from '~/utils/authenticateUser'
import { budgetSchema } from '~/zodSchemas/budgetInfo'

export async function action({ request }: ActionFunctionArgs) {
    try {
        const { name, description } = budgetSchema.parse(
            Object.fromEntries(await request.formData())
        )
        const { user } = await authenticateUser(request)

        const budget = await prisma.budget.create({
            data: {
                name,
                description,
                userId: user.id,
            },
        })

        return redirect(`/budget/${budget.id}`)
    } catch (e) {
        throw new ServerErrorResponse({
            message: 'Budget not able to be created.',
            status: 404,
        })
    }
}
