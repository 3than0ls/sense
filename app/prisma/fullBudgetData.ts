import prisma from '~/prisma/client'
import getStartOfMonth from '~/utils/getStartOfMonth'

/**
 * Given a budget ID and user ID, retrieve ALL of the budget's data, which includes
 */
export default async function fullBudgetData({
    budgetId,
    userId,
}: {
    budgetId: string
    userId: string
}) {
    const baseData = await prisma.budget.findFirstOrThrow({
        where: {
            id: budgetId,
            userId: userId,
        },
        include: {
            budgetCategories: {
                include: {
                    budgetItems: {
                        include: {
                            transactions: true,
                            assignments: {
                                where: {
                                    createdAt: {
                                        gte: getStartOfMonth(),
                                    },
                                },
                                take: 1,
                            },
                        },
                        orderBy: [
                            {
                                order: 'asc',
                            },
                            {
                                createdAt: 'desc',
                            },
                        ],
                    },
                },
                orderBy: {
                    order: 'asc',
                },
            },
            accounts: {
                include: {
                    transactions: {
                        where: {
                            budgetItemId: null,
                        },
                    },
                },
            },
        },
    })

    return baseData
}

export type FullBudgetDataType = Awaited<ReturnType<typeof fullBudgetData>>
