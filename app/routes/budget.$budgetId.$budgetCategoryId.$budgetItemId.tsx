import { BudgetItem } from '@prisma/client'
import { json, LoaderFunctionArgs, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { isAuthApiError } from '@supabase/supabase-js'
import { z } from 'zod'
import BudgetMenuForm from '~/components/budget/BudgetMenuForm'
import BudgetMenuItemAssignMoney from '~/components/budget/BudgetMenuItemAssignMoney'
import Icon from '~/components/icons/Icon'
import { useModal } from '~/context/ModalContext'
import { useTheme } from '~/context/ThemeContext'
import ServerErrorResponse from '~/error'
import prisma from '~/prisma/client'
import authenticateUser from '~/utils/authenticateUser'
import itemNameSchema from '~/zodSchemas/budgetItem'
import numberSchema from '~/zodSchemas/number'

export async function loader({ params, request }: LoaderFunctionArgs) {
    // split between just using outlet context to cut out another fetching step,
    // but will likely do a refetch so revalidating is easy

    // a concern is that fetching all budget items here is any unecessary step (that may? significantly increase loading time)
    // allBudgetItem data is only used when assigning money for the assign money modal
    // and could technically just be fetched only for that step
    // an improvement would be to do that, but this suffices.

    try {
        const { user } = await authenticateUser(request)

        const allBudgetItems = await prisma.budgetItem.findMany({
            where: {
                BudgetCategory: {
                    budgetId: params.budgetId,
                },
                userId: user.id,
            },
            include: {
                BudgetCategory: true,
            },
        })
        console.log(allBudgetItems)
        const budgetItem = allBudgetItems.find(
            (bItem) => bItem.id === params.budgetItemId
        )
        console.log(budgetItem)
        if (allBudgetItems === null || budgetItem === undefined) {
            throw new Error()
        }

        return json({ allBudgetItems, budgetItem })
    } catch (e) {
        if (isAuthApiError(e)) {
            throw new ServerErrorResponse(e)
        } else {
            return redirect(`/budget/${params.budgetId}`)
            // throw new ServerErrorResponse({
            //     message: 'Budget Item not found.',
            //     status: 404,
            // })
        }
    }
}

export default function BudgetItemEditRoute() {
    const { budgetItem, allBudgetItems } = useLoaderData<typeof loader>()

    const { theme } = useTheme()
    const themeStyle = theme === 'DARK' ? 'bg-black' : 'bg-white'
    const altThemeStyle = theme === 'DARK' ? 'bg-dark' : 'bg-light'

    const { setActive, setModalChildren } = useModal()
    const onAssignMoneyClick = () => {
        // quirk in which if you set a value, but then don't change it but exit modal, state is retained
        // only if key is same
        setModalChildren(
            <BudgetMenuItemAssignMoney
                key={budgetItem.id}
                budgetItems={allBudgetItems as unknown as BudgetItem[]}
                target={budgetItem as unknown as BudgetItem}
            />
        )
        setActive(true)
    }

    return (
        <div
            className={`flex flex-col gap-4 size-full p-4 text-sm ${themeStyle} rounded-xl w-full h-full`}
        >
            <div className="flex flex-col w-full justify-center items-center">
                <BudgetMenuForm
                    key={budgetItem.name}
                    defaultValue={budgetItem.name}
                    label="Name"
                    name="name"
                    schema={itemNameSchema}
                    action="/api/budItem/rename"
                />
            </div>
            <hr className={`h-[1px] border-none ${altThemeStyle} bg-subtle`} />
            <div className="flex flex-col w-full gap-1">
                <div className="mx-1 flex gap-3 items-center text-lg">
                    <span>Balance</span>
                    <hr className="bg-balance border-0 aspect-square h-2 rounded-full" />
                    <span className="ml-auto">
                        ${budgetItem.balance.toFixed(2)}
                    </span>
                </div>
            </div>
            <hr className={`h-[1px] border-none ${altThemeStyle} bg-subtle`} />
            <div className="flex flex-col w-full gap-1">
                <div className="mx-1 flex gap-3 items-center text-lg">
                    <span>Assigned</span>
                    <hr className="bg-assigned border-0 aspect-square h-2 rounded-full" />
                    <span className="ml-auto">
                        ${budgetItem.assigned.toFixed(2)}
                    </span>
                </div>
                <button
                    className={`${altThemeStyle} rounded-xl hover:bg-opacity-80 transition px-4 py-2 flex justify-center gap-2 items-center`}
                    onClick={onAssignMoneyClick}
                >
                    <span>Assign Money</span>
                    <Icon type="plus-circle" />
                </button>
            </div>
            <hr className={`h-[1px] border-none ${altThemeStyle} bg-subtle`} />
            <div className="flex flex-col w-full justify-center items-center relative">
                <div className="absolute mx-1 inset-0 flex text-lg w-fit h-fit gap-3 items-center">
                    <span className="text-transparent">Target</span>
                    <hr className="bg-target border-0 aspect-square h-2 rounded-full" />
                </div>
                <BudgetMenuForm
                    key={budgetItem.target}
                    defaultValue={budgetItem.target.toFixed(2).toString()}
                    label="Target"
                    name="target"
                    schema={z.object({
                        target: numberSchema,
                    })}
                />
            </div>
        </div>
    )
}
