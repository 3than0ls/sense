import { BudgetItem } from '@prisma/client'
import { json, LoaderFunctionArgs, redirect } from '@remix-run/node'
import { useLoaderData, useNavigate } from '@remix-run/react'
import { isAuthApiError } from '@supabase/supabase-js'
import BudgetMenuForm from '~/components/budget/BudgetMenuForm'
import AssignmentForm from '~/components/budget/AssignmentForm'
import Icon from '~/components/icons/Icon'
import { useModal } from '~/context/ModalContext'
import { useTheme } from '~/context/ThemeContext'
import ServerErrorResponse from '~/error'
import prisma from '~/prisma/client'
import authenticateUser from '~/utils/authenticateUser'
import { totalAssignments, totalTransactions } from '~/utils/budgetValues'
import { itemNameSchema, itemTargetSchema } from '~/zodSchemas/budgetItem'
import DeleteButton from '~/components/DeleteButton'
import Divider from '~/components/Divider'
import DeleteForm from '~/components/DeleteForm'
import toCurrencyString from '~/utils/toCurrencyString'

export async function loader({ params, request }: LoaderFunctionArgs) {
    try {
        const { user } = await authenticateUser(request)

        const budgetItem = await prisma.budgetItem.findFirstOrThrow({
            where: {
                id: params.budgetItemId,
                budgetId: params.budgetId,
                budget: {
                    userId: user.id,
                },
            },
            include: {
                assignments: true,
                transactions: true,
            },
        })

        const assigned = totalAssignments(budgetItem.assignments)
        const spent = totalTransactions(budgetItem.transactions)
        const balance = assigned - spent

        return json({ budgetItem, assigned, balance, spent })
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
    const { budgetItem, balance, assigned } = useLoaderData<typeof loader>()

    const { theme } = useTheme()
    const themeStyle = theme === 'DARK' ? 'bg-black' : 'bg-white'
    const altThemeStyle = theme === 'DARK' ? 'bg-dark' : 'bg-light'

    const { setActive, setModalTitle, setModalChildren } = useModal()
    const onAssignClick = () => {
        setModalTitle(`Assign Money to ${budgetItem.name}`)
        setModalChildren(
            <AssignmentForm
                targetBudgetItem={budgetItem as unknown as BudgetItem}
                targetBudgetItemAssigned={assigned}
            />
        )
        setActive(true)
    }

    const navigate = useNavigate()
    const onDeleteClick = () => {
        setModalTitle('Confirm Deletion')
        setModalChildren(
            <DeleteForm
                deleteItemName={budgetItem.name}
                fetcherAction="/api/budItem/delete"
                fetcherTarget={{ budgetItemId: budgetItem.id }}
                onSubmitLoad={() => navigate(`/budget/${budgetItem.budgetId}`)} //  <-- doesn't matter since auto-navigates back anyway
            >
                <span>
                    All transactions to and from this item will also be deleted!
                    You may have to manually reconcile your account balance if
                    you do this.
                </span>
            </DeleteForm>
        )
        setActive(true)
    }

    return (
        <div
            className={`flex flex-col gap-4 size-full p-4 text-sm ${themeStyle} rounded-xl min-w-full h-fit`}
        >
            <div className="flex flex-col w-full justify-center items-center">
                <BudgetMenuForm
                    key={budgetItem.name}
                    defaultValue={budgetItem.name}
                    label="Name"
                    name="name"
                    schema={itemNameSchema}
                    action="/api/budItem/rename"
                    itemUuid={budgetItem.id}
                />
            </div>
            <Divider />
            <div className="flex flex-col w-full gap-1">
                <div className="mx-1 flex gap-3 items-center text-lg">
                    <span>Balance</span>
                    <hr className="bg-balance border-0 aspect-square h-2 rounded-full" />
                    <span className="ml-auto">{toCurrencyString(balance)}</span>
                </div>
            </div>
            <Divider />
            <div className="flex flex-col min-w-full gap-1">
                <div className="mx-1 flex gap-3 items-center text-lg">
                    <span>Assigned</span>
                    <hr className="bg-assigned border-0 aspect-square h-2 rounded-full" />
                    <span className="ml-auto">
                        {toCurrencyString(assigned)}
                    </span>
                </div>
                <button
                    className={`${altThemeStyle} w-full rounded-xl hover:bg-opacity-80 transition px-4 py-2 flex justify-center gap-2 items-center`}
                    onClick={onAssignClick}
                >
                    <span>Assign Money</span>
                    <Icon type="plus-circle" />
                </button>
            </div>
            <Divider />
            <div className="flex flex-col w-full justify-center items-center relative">
                <div className="absolute mx-1 inset-0 flex text-lg w-fit h-fit gap-3 items-center">
                    <span className="text-transparent">Target</span>
                    <hr className="bg-target border-0 aspect-square h-2 rounded-full" />
                </div>
                <BudgetMenuForm
                    key={budgetItem.target}
                    defaultValue={budgetItem.target.toFixed(2)}
                    label="Target"
                    name="target"
                    schema={itemTargetSchema}
                    action="/api/budItem/retarget"
                    itemUuid={budgetItem.id}
                    isMoney
                />
            </div>

            <Divider className="mt-auto border-subtle" />
            <DeleteButton
                className="flex justify-center items-center gap-4 h-10"
                onClick={onDeleteClick}
            >
                Delete Item
                <Icon type="trash" className="size-5" />
            </DeleteButton>
        </div>
    )
}
