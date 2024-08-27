import { ActionFunctionArgs } from '@remix-run/node'
import ServerErrorResponse from '~/error'
import prisma from '~/prisma/client'
import authenticateUser from '~/utils/authenticateUser'
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

        // https://www.prisma.io/docs/orm/prisma-client/queries/transactions#interactive-transactions
        await prisma.$transaction(async (tx) => {
            const budgetItem = await tx.budgetItem.findFirstOrThrow({
                where: {
                    userId: user.id,
                    id: targetBudgetItemId,
                },
            })

            if (fromFreeCash) {
                const budget = await tx.budget.findFirstOrThrow({
                    where: {
                        userId: user.id,
                        budgetCategories: {
                            some: {
                                budgetItems: {
                                    some: {
                                        id: targetBudgetItemId,
                                    },
                                },
                            },
                        },
                    },
                })
                if (budget.freeCash < amount) {
                    throw new Error('Not enough free cash, amount is too high.')
                }
                await tx.budget.update({
                    where: {
                        id: budget.id,
                        userId: user.id,
                    },
                    data: {
                        freeCash: budget.freeCash - amount,
                    },
                })
            } else {
                const fromBudgetItem = await tx.budgetItem.findFirstOrThrow({
                    where: {
                        id: fromBudgetItemId,
                        userId: user.id,
                    },
                })
                // assigned - balance = free cash to be able to be moved; assigned money doesn't always mean it can be moved
                if (fromBudgetItem.assigned - fromBudgetItem.balance < amount) {
                    throw new Error('Not enough free cash, amount is too high.')
                }
                await tx.budgetItem.update({
                    where: {
                        id: fromBudgetItem.id,
                    },
                    data: {
                        assigned: fromBudgetItem.assigned - amount,
                    },
                })
            }
            await tx.budgetItem.update({
                where: {
                    userId: user.id,
                    id: targetBudgetItemId,
                },
                data: {
                    assigned: budgetItem.assigned + amount,
                },
            })
        })
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
