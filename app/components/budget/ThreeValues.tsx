import { useModal } from '~/context/ModalContext'
import TransactionForm from './TransactionForm'
import { Link } from '@remix-run/react'
import toCurrencyString from '~/utils/toCurrencyString'
import { FullBudgetType } from '~/prisma/fullBudgetData'
import { useBudgetData } from '~/context/BudgetDataContext'
import { useBudgetUX } from '~/context/BudgetUXContext'

type ThreeValuesProps = {
    balance: number
    assigned: number
    budgetItem: FullBudgetType['budgetItems'][number]
}

const ThreeValues = ({ balance, assigned, budgetItem }: ThreeValuesProps) => {
    const { setModalTitle, setModalChildren, setActive } = useModal()
    const budgetData = useBudgetData()

    const { updateBudgetUX } = useBudgetUX()

    const onBalanceClick = () => {
        updateBudgetUX({ focus: null })
        setModalChildren(
            <TransactionForm
                basicBudgetData={budgetData}
                defaultBudgetItem={budgetItem}
            />
        )
        setModalTitle('Log Transaction')
        setActive(true)
    }
    const onTargetClick = () => {
        updateBudgetUX({ focus: 'target' })
    }
    const onAssignClick = () => {
        updateBudgetUX({ focus: 'assign' })
    }

    const balanceError = balance < 0
    // const assignWarn = assigned > budgetItem.target

    return (
        <div className="flex items-center gap-4 min-h-10">
            <Link
                to={`/budget/${budgetItem.budgetId}/i/${budgetItem.id}`}
                onClick={onBalanceClick}
                className="w-24 flex justify-end items-center gap-2"
            >
                <span className={`text-right ${balanceError && 'text-bad'}`}>
                    {toCurrencyString(balance)}
                </span>
                <hr className="bg-balance border-0 aspect-square h-2 rounded-full" />
            </Link>
            <Link
                to={`/budget/${budgetItem.budgetId}/i/${budgetItem.id}`}
                onClick={onAssignClick}
                className="w-24 flex justify-end items-center gap-2"
            >
                <span className={`text-right`}>
                    {toCurrencyString(assigned)}
                </span>
                <hr className="bg-assigned border-0 aspect-square h-2 rounded-full" />
            </Link>
            <Link
                to={`/budget/${budgetItem.budgetId}/i/${budgetItem.id}`}
                onClick={onTargetClick}
                className="w-24 flex justify-end items-center gap-2"
            >
                <span className="text-right">
                    {toCurrencyString(budgetItem.target)}
                </span>
                <hr className="bg-target border-0 aspect-square h-2 rounded-full" />
            </Link>
        </div>
    )
}

export default ThreeValues
