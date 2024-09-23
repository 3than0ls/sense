import getStartOfMonth from '~/utils/getStartOfMonth'
import prisma from './client'

/**
 * Given a budget item id and user id, get full budget item data
 */
export default async function currentMonthBudgetItemData({
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

export type ServerCurrentMonthBudgetItemType = Awaited<
    ReturnType<typeof currentMonthBudgetItemData>
>

type ReplaceDatesWithStrings<T> = {
    [K in keyof T]: T[K] extends Date
        ? string
        : T[K] extends object
        ? ReplaceDatesWithStrings<T[K]>
        : T[K]
}

// also the client one
export type CurrentMonthBudgetItemType =
    ReplaceDatesWithStrings<ServerCurrentMonthBudgetItemType>
