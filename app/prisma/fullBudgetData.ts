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
            budgetItems: {
                orderBy: { createdAt: 'desc' },
            },
            budgetCategories: {
                orderBy: { createdAt: 'desc' },
            },
            accounts: {
                orderBy: { createdAt: 'desc' },
            },
            assignments: {
                where: {
                    createdAt: {
                        gte: getStartOfMonth(),
                    },
                },
                orderBy: { createdAt: 'desc' },
            },
            transactions: true,
        },
    })

    return baseData
}

export type ServerFullBudgetType = Awaited<ReturnType<typeof fullBudgetData>>

export type ReplaceDatesWithStrings<T> = {
    [K in keyof T]: T[K] extends Date
        ? string
        : T[K] extends object
        ? ReplaceDatesWithStrings<T[K]>
        : T[K]
}

// also the client one
export type FullBudgetType = ReplaceDatesWithStrings<ServerFullBudgetType>
