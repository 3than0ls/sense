import getStartOfMonth from '~/utils/getStartOfMonth'
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
            assignments: {
                where: {
                    createdAt: {
                        gte: getStartOfMonth(),
                    },
                },
                take: 1,
            },
            transactions: {
                include: {
                    account: {
                        select: {
                            name: true,
                        },
                    },
                },
                orderBy: {
                    date: 'desc',
                },
                where: {
                    date: {
                        gte: getStartOfMonth(),
                    },
                },
            },
        },
    })

    return baseData
}

export type FullBudgetItemDataType = Awaited<
    ReturnType<typeof fullBudgetItemData>
>
