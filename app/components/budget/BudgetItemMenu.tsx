import { useFetcher, useNavigate } from '@remix-run/react'
import { useMemo } from 'react'
import { useModal } from '~/context/ModalContext'
import { useTheme } from '~/context/ThemeContext'
import { FullBudgetType } from '~/prisma/fullBudgetData'
import toCurrencyString from '~/utils/toCurrencyString'
import {
    itemNameSchema,
    itemAssignedSchema,
    itemTargetSchema,
} from '~/zodSchemas/budgetItem'
import DeleteButton from '../DeleteButton'
import DeleteForm from '../DeleteForm'
import Divider from '../Divider'
import Icon from '../icons/Icon'
import BudgetMenuForm from './BudgetMenuForm'
import {
    budgetItemCurrentMonthAssignedAmount,
    budgetItemCurrentMonthTransactionAmount,
} from '~/utils/budgetValues'
import { useFindRelation } from '~/context/BudgetDataContext'
import { useBudgetUX } from '~/context/BudgetUXContext'

type BudgetItemMenuProps = {
    budgetItem: FullBudgetType['budgetItems'][number]
}

const BudgetItemMenu = ({ budgetItem }: BudgetItemMenuProps) => {
    const assigned = budgetItemCurrentMonthAssignedAmount(
        useFindRelation('assignments', 'budgetItemId', budgetItem.id)
    )
    const transactions = useFindRelation(
        'transactions',
        'budgetItemId',
        budgetItem.id
    )
    const currentMonthTransactions = useMemo(
        () => budgetItemCurrentMonthTransactionAmount(transactions),
        [transactions]
    )
    const balance = assigned - currentMonthTransactions

    const { theme } = useTheme()
    const themeStyle = theme === 'DARK' ? 'bg-black' : 'bg-white'
    const altThemeStyle = theme === 'DARK' ? 'bg-dark' : 'bg-light'

    const { setActive, setModalTitle, setModalChildren } = useModal()
    const fetcher = useFetcher()
    const onReachTargetClick = () => {
        fetcher.submit(
            { id: budgetItem.id, amount: budgetItem.target },
            {
                action: '/api/budItem/reassign',
                method: 'POST',
            }
        )
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

    const focus = useBudgetUX().budgetUX.focus

    return (
        <div
            key={budgetItem.id}
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
                    focus={focus === 'itname'}
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
            <div className="flex flex-col min-w-full gap-2 relative">
                <div className="absolute mx-1 inset-0 flex text-lg w-fit h-fit gap-3 items-center">
                    <span className="invisible">Assigned</span>
                    <hr className="bg-assigned border-0 aspect-square h-2 rounded-full" />
                </div>
                <BudgetMenuForm
                    key={'assigned' + assigned.toFixed(2)}
                    defaultValue={assigned.toFixed(2)}
                    label="Assigned"
                    name="amount"
                    schema={itemAssignedSchema}
                    action="/api/budItem/reassign"
                    itemUuid={budgetItem.id}
                    isMoney
                    focus={focus === 'assign'}
                />
                <button
                    disabled={assigned === budgetItem.target}
                    className={`${altThemeStyle} disabled:opacity-80 disabled:bg-opacity-80 w-full rounded-lg hover:bg-opacity-80 transition px-4 py-2 flex justify-center gap-2 items-center`}
                    onClick={onReachTargetClick}
                >
                    <span className="text-xs">Reach Target</span>
                    {fetcher.state === 'idle' ? (
                        <Icon type="plus-circle" className="size-4" />
                    ) : (
                        <Icon type="spinner" className="size-4 animate-spin" />
                    )}
                </button>
            </div>
            <Divider />
            <div className="flex flex-col w-full justify-center items-center relative">
                <div className="absolute mx-1 inset-0 flex text-lg w-fit h-fit gap-3 items-center">
                    <span className="invisible">Target</span>
                    <hr className="bg-target border-0 aspect-square h-2 rounded-full" />
                </div>
                <BudgetMenuForm
                    key={'target' + budgetItem.target.toFixed(2)}
                    defaultValue={budgetItem.target.toFixed(2)}
                    label="Target"
                    name="target"
                    schema={itemTargetSchema}
                    action="/api/budItem/retarget"
                    itemUuid={budgetItem.id}
                    isMoney
                    focus={focus === 'target'}
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

export default BudgetItemMenu
