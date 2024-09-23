import prisma from '~/prisma/client'
import { ReplaceDatesWithStrings } from './fullBudgetData'

/**
 * Given a budget ID and user ID, retrieve ALL of the budget's data, which includes
 */
export default async function fullAccountData({
    accountId,
    userId,
}: {
    accountId: string
    userId: string
}) {
    const baseData = await prisma.account.findFirstOrThrow({
        where: {
            id: accountId,
            budget: { userId: userId },
        },
        include: {
            budget: true,
            transactions: {
                orderBy: {
                    date: 'desc',
                },
                include: {
                    budgetItem: {
                        // include: { budgetCategory: { select: { name: true } } },
                        select: {
                            name: true,
                            id: true,
                            budgetCategory: {
                                select: { name: true, id: true },
                            },
                        },
                    },
                },
            },
        },
    })

    return baseData
}

export type ServerFullAccountType = Awaited<ReturnType<typeof fullAccountData>>

export type FullAccountType = ReplaceDatesWithStrings<ServerFullAccountType>

export async function basicBudgetData({
    budgetId,
    userId,
}: {
    budgetId: string
    userId: string
}) {
    const basicBudgetData = await prisma.budget.findFirstOrThrow({
        where: {
            id: budgetId,
            userId,
        },
        select: {
            name: true,
            id: true,
            budgetItems: {
                select: {
                    name: true,
                    id: true,
                },
            },
            accounts: {
                select: {
                    name: true,
                    id: true,
                },
            },
        },
    })

    return basicBudgetData
}

export type ServerBasicBudgetType = Awaited<ReturnType<typeof basicBudgetData>>

export type BasicBudgetType = ReplaceDatesWithStrings<ServerBasicBudgetType>
