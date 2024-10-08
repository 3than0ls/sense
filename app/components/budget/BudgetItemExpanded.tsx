import BudgetItemExpandedBar from './BudgetItemExpandedBar'
import { useTheme } from '~/context/ThemeContext'
import Icon from '../icons/Icon'
import Information from '../Information'
import BudgetItemExpandedTable from './BudgetItemExpandedTable'
import { useModal } from '~/context/ModalContext'
import TransactionForm from './TransactionForm'
import toCurrencyString from '~/utils/toCurrencyString'
import { FullBudgetType } from '~/prisma/fullBudgetData'
import { useBudgetData } from '~/context/BudgetDataContext'

type BudgetItemExpandedProps = {
    budgetItem: FullBudgetType['budgetItems'][number]
    assigned: number
    balance: number
}

const BudgetItemExpandedButton = ({
    onClick,
    children,
}: {
    onClick: () => void
    children: React.ReactNode
}) => {
    const { theme } = useTheme()
    const themeStyles =
        theme === 'LIGHT' ? 'bg-light text-light' : 'bg-dark text-dark'

    return (
        <button
            onClick={onClick}
            className={`text-sm min-w-48 flex gap-2 rounded-xl px-2 py-3 transition ${themeStyles} hover:bg-opacity-85 items-center justify-center`}
        >
            {children}
        </button>
    )
}

const BudgetItemExpanded = ({
    budgetItem: { target, id, name },
    assigned,
    balance,
}: BudgetItemExpandedProps) => {
    let tip = undefined
    if (balance < 0) {
        tip =
            "You've over-spent on this item! Reassign money to balance it out."
    } else if (target === 0) {
        tip = 'Set a target for this item.'
    } else if (balance === 0 && target === assigned) {
        tip =
            "You've reached your target and spent all the money for this period."
    } else if (balance === 0 && assigned < target) {
        tip =
            "You've spent all the money assigned to this item. Assign more if needed."
    } else if (assigned < target) {
        tip = `Assign ${toCurrencyString(
            target - assigned
        )} more to reach your target of ${toCurrencyString(target)}.`
    } else if (assigned > target) {
        tip = `You've over-assigned your target by ${toCurrencyString(
            assigned - target
        )}! Consider adjusting your target.`
    } else if (assigned === target) {
        tip = `You've met your target! You have ${toCurrencyString(
            balance
        )} left to spend.`
    }

    const budgetData = useBudgetData()

    const { setModalChildren, setModalTitle, setActive } = useModal()

    const onTransacClick = () => {
        setModalChildren(
            <TransactionForm
                basicBudgetData={budgetData}
                defaultBudgetItem={{ name, id }}
            />
        )
        setModalTitle('Log Transaction')
        setActive(true)
    }

    return (
        <div className="w-full mb-4 flex flex-col">
            <BudgetItemExpandedBar
                assigned={assigned}
                balance={balance}
                target={target}
            />
            <div className="flex flex-col gap-4 py-3 px-5 w-full">
                <div className="flex items-center gap-4">
                    <Information divClassName="flex-grow ml-2">
                        {tip}
                    </Information>
                    <BudgetItemExpandedButton onClick={onTransacClick}>
                        Add Transaction
                        <Icon type="currency-dollar" />
                    </BudgetItemExpandedButton>
                </div>
                <BudgetItemExpandedTable
                    budgetItemName={name}
                    budgetItemId={id}
                />
            </div>
        </div>
    )
}

export default BudgetItemExpanded
