import { ActionFunctionArgs } from '@remix-run/node'
import ServerErrorResponse from '~/error'
import prisma from '~/prisma/client'
import authenticateUser from '~/utils/authenticateUser'
import {
    budgetItemTotalAssignments,
    budgetItemTotalTransactions,
    budgetTotalAccounts,
    budgetTotalAssignments,
} from '~/utils/budgetValues'
import { itemAssignMoneySchema } from '~/zodSchemas/budgetItem'

/*
Could also be called: budget.$budgetId.$budgetCategoryId.$budgetItemId.assign.tsx
But names seem to be getting longer and longer...
But then again having a vague thing here is also vague.
A decision will be made later; code remains the same
*/

export async function loader({ request }: ActionFunctionArgs) {
    // you shuld NOT be able to navigate here... redirect immediately!
    // TODO
    return {}
}

export async function action({ request }: ActionFunctionArgs) {
    try {
        const data = await request.formData()
        const { amount, fromBudgetItemId, fromFreeCash, targetBudgetItemId } =
            itemAssignMoneySchema.parse(Object.fromEntries(data))
        const { user } = await authenticateUser(request)

        const budgetItem = await prisma.budgetItem.findFirstOrThrow({
            where: {
                budget: {
                    userId: user.id,
                },
                id: targetBudgetItemId,
            },
        })
        const budget = await prisma.budget.findFirstOrThrow({
            where: {
                userId: user.id,
                budgetItems: {
                    some: {
                        id: targetBudgetItemId,
                    },
                },
            },
            include: {
                // could just select amount here... but eh... optimize later...
                accounts: true,
                assignments: true,
            },
        })

        if (fromFreeCash) {
            const totalCash = budgetTotalAccounts(budget.accounts)
            const assigned = budgetTotalAssignments(budget.assignments)
            const freeCash = totalCash - assigned
            if (freeCash < amount) {
                throw new Error('Not enough free cash, amount is too high.')
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
                const totalTransacs = budgetItemTotalTransactions(
                    fromBudgetItem.transactions
                )
                const assigned = budgetItemTotalAssignments(
                    fromBudgetItem.assignments
                )
                // assigned - balance = free cash to be able to be moved; assigned money doesn't always mean it can be moved
                if (assigned - totalTransacs < amount) {
                    throw new Error('Not enough free cash, amount is too high.')
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
        if (
            e instanceof Error &&
            e.message === 'Not enough free cash, amount is too high.'
        ) {
            return {
                success: false,
                reason: e.message,
            }
        }
        throw new ServerErrorResponse()
    }
}
