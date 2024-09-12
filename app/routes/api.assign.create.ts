import { ActionFunctionArgs } from '@remix-run/node'
import ServerErrorResponse from '~/error'
import prisma from '~/prisma/client'
import { FullBudgetDataType } from '~/prisma/fullBudgetData'
import authenticateUser from '~/utils/authenticateUser'
import {
    totalAssignments,
    totalTransactions,
    budgetTotalAccounts,
} from '~/utils/budgetValues'
import { assignmentSchema } from '~/zodSchemas/assignment'

/*
Could also be called: budget.$budgetId.$budgetCategoryId.$budgetItemId.assign.tsx
But names seem to be getting longer and longer...
But then again having a vague thing here is also vague.
A decision will be made later; code remains the same
*/

export async function action({ request }: ActionFunctionArgs) {
    try {
        const data = await request.formData()
        const { amount, fromBudgetItemId, fromFreeCash, toBudgetItemId } =
            assignmentSchema.parse(Object.fromEntries(data))
        const { user } = await authenticateUser(request)

        const budgetItem = await prisma.budgetItem.findFirstOrThrow({
            where: {
                budget: {
                    userId: user.id,
                },
                id: toBudgetItemId,
            },
        })
        const budget = await prisma.budget.findFirstOrThrow({
            where: {
                userId: user.id,
                budgetItems: {
                    some: {
                        id: toBudgetItemId,
                    },
                },
            },
            include: {
                // could just select amount here... but eh... optimize later...
                accounts: {},
                assignments: true,
            },
        })

        if (fromFreeCash) {
            // I've been naughty typescript...
            const totalCash = budgetTotalAccounts(
                budget as unknown as FullBudgetDataType
            )
            const assigned = totalAssignments(budget.assignments)
            const freeCash = totalCash - assigned
            if (freeCash < amount) {
                throw new Error('Amount is too high, not enough free cash.', {
                    cause: 1,
                })
            }
            await prisma.assignment.create({
                data: {
                    amount: amount,
                    budgetId: budget.id,
                    budgetItemId: budgetItem.id,
                },
            })
        } else {
            // to take from another item, simply create a assignment taking away from the fromBudgetItem and another assignment for the budgetItem
            // https://www.prisma.io/docs/orm/prisma-client/queries/transactions#interactive-transactions
            await prisma.$transaction(async (tx) => {
                const fromBudgetItem = await tx.budgetItem.findFirstOrThrow({
                    where: {
                        id: fromBudgetItemId,
                        budget: {
                            userId: user.id,
                        },
                    },
                    include: {
                        assignments: true,
                        transactions: true,
                    },
                })
                const totalTransacs = totalTransactions(
                    fromBudgetItem.transactions
                )
                const assigned = totalAssignments(fromBudgetItem.assignments)
                // assigned - balance = free cash to be able to be moved; assigned money doesn't always mean it can be moved
                if (assigned - totalTransacs < amount) {
                    throw new Error(
                        `Amount is too high, not enough assigned cash in ${fromBudgetItem.name}.`,
                        { cause: 1 }
                    )
                }

                // take away from fromBudgetItem
                await prisma.assignment.create({
                    data: {
                        amount: -amount,
                        budgetId: budget.id,
                        budgetItemId: fromBudgetItem.id,
                    },
                })
                // add to target budgetItem
                await prisma.assignment.create({
                    data: {
                        amount: amount,
                        budgetId: budget.id,
                        budgetItemId: budgetItem.id,
                    },
                })
            })
        }

        return {
            success: true,
            reason: '',
        }
    } catch (e) {
        if (e instanceof Error && e.cause === 1) {
            return {
                success: false,
                reason: e.message,
            }
        }
        throw new ServerErrorResponse()
    }
}
