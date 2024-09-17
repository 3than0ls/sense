import { useModal } from '~/context/ModalContext'
import { BudgetItem } from '@prisma/client'
import TransactionForm from './TransactionForm'
import { Link, useNavigate, useParams } from '@remix-run/react'
import toCurrencyString from '~/utils/toCurrencyString'

type ThreeValuesProps = {
    balance: number
    assigned: number
    budgetItem: BudgetItem
}

const ThreeValues = ({ balance, assigned, budgetItem }: ThreeValuesProps) => {
    const { setModalTitle, setModalChildren, setActive } = useModal()

    const params = useParams()
    const navigate = useNavigate()

    const onBalanceClick = () => {
        setModalChildren(
            <TransactionForm
                budgetId={budgetItem.budgetId}
                defaultBudgetItem={budgetItem}
            />
        )
        setModalTitle('Log Transaction')
        setActive(true)
    }

    const balanceError = balance < 0
    // const assignWarn = assigned > budgetItem.target

    return (
        <div className="flex items-center gap-4 min-h-10">
            <Link
                to={`${budgetItem.budgetCategoryId}/${budgetItem.id}`}
                onClick={onBalanceClick}
                className="w-24 flex justify-end items-center gap-2"
            >
                <span className={`text-right ${balanceError && 'text-bad'}`}>
                    {toCurrencyString(balance)}
                </span>
                <hr className="bg-balance border-0 aspect-square h-2 rounded-full" />
            </Link>
            <Link
                to={`${budgetItem.budgetCategoryId}/${budgetItem.id}?f=assign`}
                className="w-24 flex justify-end items-center gap-2"
            >
                <span className={`text-right`}>
                    {toCurrencyString(assigned)}
                </span>
                <hr className="bg-assigned border-0 aspect-square h-2 rounded-full" />
            </Link>
            <Link
                to={`${budgetItem.budgetCategoryId}/${budgetItem.id}?f=target`}
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
