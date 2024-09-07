import prisma from '~/prisma/client'

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
                    date: 'asc',
                },
                include: {
                    budgetItem: {
                        // include: { budgetCategory: { select: { name: true } } },
                        select: {
                            name: true,
                            budgetCategory: { select: { name: true } },
                        },
                    },
                },
            },
        },
    })

    return baseData
}

export type FullAccountDataType = Awaited<ReturnType<typeof fullAccountData>>
