import { ActionFunctionArgs, json } from '@remix-run/node'
import ServerErrorResponse from '~/error'
import prisma from '~/prisma/client'
import authenticateUser from '~/utils/authenticateUser'
import { updateBudgetSchema } from '~/zodSchemas/budgetInfo'

export async function action({ request }: ActionFunctionArgs) {
    try {
        const data = await request.formData()
        const { name, description, budgetId } = updateBudgetSchema.parse(
            Object.fromEntries(data)
        )

        const { user } = await authenticateUser(request)

        const updatedBudget = await prisma.budget.update({
            where: {
                id: budgetId,
                userId: user.id,
            },
            data: {
                name: name,
                description: description,
            },
        })

        return json(updatedBudget)
    } catch (e) {
        throw new ServerErrorResponse({
            message: 'Budget not able to be edited.',
            status: 404,
        })
    }
}
