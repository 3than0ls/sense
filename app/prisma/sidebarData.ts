import prisma from '~/prisma/client'
import { ReplaceDatesWithStrings } from './fullBudgetData'

/**
 * Given a userID, return all data required for the left sidebar on budget and account routes
 */
export default async function getSidebarData({ userId }: { userId: string }) {
    return await prisma.budget.findMany({
        where: {
            userId: userId,
        },
        include: {
            accounts: {
                orderBy: {
                    createdAt: 'asc',
                },
            },
        },
    })
}

export type SidebarDataType = ReplaceDatesWithStrings<
    Awaited<ReturnType<typeof getSidebarData>>
>
