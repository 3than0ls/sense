import prisma from '~/prisma/client'
import { ReplaceDatesWithStrings } from './fullBudgetData'

/**
 * Given a userID, return all data required for the landing page and navbar
 */
export default async function getUserData({ userId }: { userId: string }) {
    return await prisma.user.findFirstOrThrow({
        where: {
            id: userId,
        },
        include: {
            budgets: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    })
}

export type UserDataType = ReplaceDatesWithStrings<
    Awaited<ReturnType<typeof getUserData>>
>
