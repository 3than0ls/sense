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
                    account: { select: { name: true } }, // I know I know but fk this
                },
            },
        },
    })

    return baseData
}

export type FullAccountDataType = Awaited<ReturnType<typeof fullAccountData>>
