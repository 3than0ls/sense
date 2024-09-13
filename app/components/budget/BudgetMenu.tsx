import { Outlet } from '@remix-run/react'
import Icon from '../icons/Icon'
import {
    budgetTotalAccounts,
    budgetTotalAssignments,
    totalBudgetItemTransactions,
    totalFreeCashTransactions,
} from '~/utils/budgetValues'
import { FullBudgetDataType } from '~/prisma/fullBudgetData'
import { useModal } from '~/context/ModalContext'
import TransactionForm from './TransactionForm'
import toCurrencyString from '~/utils/toCurrencyString'

type BudgetMenuProps = {
    budgetData: FullBudgetDataType
}

const BudgetMenuCard = ({ value, label }: { value: number; label: string }) => {
    return (
        <div className="bg-primary flex-grow flex flex-col text-center p-3 rounded-lg">
            <span className="font-work-bold text-xl">
                {toCurrencyString(value)}
            </span>
            <span className="text-sm">{label}</span>
        </div>
    )
}

const BudgetMenu = ({ budgetData }: BudgetMenuProps) => {
    const totalAccounts = budgetTotalAccounts(budgetData)
    const budgetItemTransactions = totalBudgetItemTransactions(budgetData)
    const freeCashTransactions = totalFreeCashTransactions(budgetData)
    const totalAssigned = budgetTotalAssignments(budgetData)
    const totalCash =
        totalAccounts + budgetItemTransactions + freeCashTransactions
    const freeCash = totalCash - totalAssigned + budgetItemTransactions

    const { setActive, setModalChildren, setModalTitle } = useModal()
    const onTransacClick = () => {
        setModalChildren(
            <TransactionForm
                budgetId={budgetData.id}
                accounts={budgetData.accounts}
                budgetItems={budgetData.budgetCategories.flatMap(
                    (cat) => cat.budgetItems
                )}
            />
        )
        setModalTitle('Log Transaction')
        setActive(true)
    }

    return (
        <div className="min-w-80 h-full flex flex-col gap-4 p-4 border-t border-l border-subtle overflow-y-auto scrollbar-custom">
            <div className="flex gap-4 w-full">
                <BudgetMenuCard label="Free Cash" value={freeCash} />
                <BudgetMenuCard label="Total Cash" value={totalCash} />
            </div>
            <div className="w-full flex flex-col gap-4">
                {/* <BudgetMenuLink href="transaction">
                    <Icon type="currency-dollar" className="size-8 mx-2" />
                    <span>Add transaction</span>
                </BudgetMenuLink> */}
                <button
                    onClick={onTransacClick}
                    className="w-full bg-primary hover:bg-opacity-60 transition-all duration-400 ease-in-out rounded-lg font-work-bold p-1.5 flex justify-center items-center"
                >
                    <Icon type="currency-dollar" className="size-8 mx-2" />
                    <span>Add transaction</span>
                </button>
                {/* <BudgetMenuLink href="assign">
                    <Icon type="plus-circle" className="size-8 mx-2" />
                    <span>Assign free cash</span>
                </BudgetMenuLink> */}
            </div>
            <Outlet />
        </div>
    )
}

export default BudgetMenu
