import prisma from './client'

/**
 * Given a budget item id and user id, get full budget item data
 */
export default async function fullBudgetItemData({
    budgetItemId,
    userId,
}: {
    budgetItemId: string
    userId: string
}) {
    const baseData = await prisma.budgetItem.findFirstOrThrow({
        where: {
            id: budgetItemId,
            budget: { userId },
        },
        include: {
            // assignments: true,
            transactions: {
                orderBy: {
                    date: 'asc',
                },
            },
        },
    })

    return baseData
}

export type FullBudgetItemDataType = Awaited<
    ReturnType<typeof fullBudgetItemData>
>
