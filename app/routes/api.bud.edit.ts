import { ActionFunctionArgs, json, redirect } from '@remix-run/node'
import ServerError from '~/error'
import prisma from '~/prisma/client'
import authenticateUser from '~/utils/authenticateUser'
import { budgetInfoSchema } from '~/zodSchemas/budgetInfo'

export async function action({ request }: ActionFunctionArgs) {
    try {
        const data = await request.formData()
        const { name, description, budgetId } = budgetInfoSchema.parse(
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

        // return redirect(`/budget/${budget.id}`)
    } catch (e) {
        // regardless of if it's an auth api error or not found error, just say bad request!
        throw new ServerError({
            message: 'Budget not able to be created.',
            status: 404,
        })
    }
}
