import { ActionFunctionArgs, json } from '@remix-run/node'
import ServerErrorResponse from '~/error'
import findOrCreateAssignmentForMonth from '~/prisma/assignmentForMonth'
import prisma from '~/prisma/client'
import authenticateUser from '~/utils/authenticateUser'
import { itemAssignedSchema } from '~/zodSchemas/budgetItem'

/*
Could also be called: budget.$budgetId.$budgetCategoryId.$budgetItemId.assign.tsx
But names seem to be getting longer and longer...
But then again having a vague thing here is also vague.
A decision will be made later; code remains the same
*/

export async function action({ request }: ActionFunctionArgs) {
    try {
        const data = await request.formData()
        // id here refers to the budgetItemId of the assignment
        const { amount, id } = itemAssignedSchema.parse(
            Object.fromEntries(data)
        )
        console.log(amount)
        const { user } = await authenticateUser(request)

        // GET BUDGET AND BUDGET ITEM TO FETCH IMPORTANT RELEVANT DATA AND ASSURE EXISTENCE
        const budgetItem = await prisma.budgetItem.findFirstOrThrow({
            where: {
                budget: {
                    userId: user.id,
                },
                id: id,
            },
        })

        // GET ASSIGNMENT FOR BUDGET ITEM IF IT EXISTS, AND IF NOT, CREATE ONE WITH DEFAULT AMT OF 0
        const assignmentForThisMonth = await findOrCreateAssignmentForMonth(
            budgetItem
        )

        const assignment = await prisma.assignment.update({
            where: {
                id: assignmentForThisMonth.id,
            },
            data: {
                amount: amount,
            },
        })

        return json(assignment)
    } catch (e) {
        throw new ServerErrorResponse()
    }
}
