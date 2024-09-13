import prisma from '~/prisma/client'

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
                            assignments: true,
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

    console.log(baseData.accounts)

    return baseData
}

export type FullBudgetDataType = Awaited<ReturnType<typeof fullBudgetData>>
