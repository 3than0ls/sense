import getStartOfMonth from '~/utils/getStartOfMonth'
import prisma from './client'
import { BudgetItem } from '@prisma/client'

export default async function findOrCreateAssignmentForMonth(
    budgetItem: Pick<BudgetItem, 'id' | 'budgetId'>
) {
    // GET ASSIGNMENT FOR BUDGET ITEM IF IT EXISTS, AND IF NOT, CREATE ONE WITH DEFAULT AMT OF 0
    let assignmentForThisMonth = await prisma.assignment.findFirst({
        where: {
            budgetItemId: budgetItem.id,
            createdAt: {
                gte: getStartOfMonth(),
            },
        },
    })
    if (assignmentForThisMonth === null) {
        assignmentForThisMonth = await prisma.assignment.create({
            data: {
                budgetItemId: budgetItem.id,
                budgetId: budgetItem.budgetId,
                amount: 0,
            },
        })
    }

    return assignmentForThisMonth
}
