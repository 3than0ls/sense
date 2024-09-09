import prisma from '~/prisma/client'

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
                    createdAt: 'desc',
                },
            },
        },
    })
}

export type SidebarDataType = Awaited<ReturnType<typeof getSidebarData>>
