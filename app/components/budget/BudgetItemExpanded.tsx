import { BudgetItem } from '@prisma/client'
import BudgetItemExpandedBar from './BudgetItemExpandedBar'
import { useTheme } from '~/context/ThemeContext'
import Icon from '../icons/Icon'
import Information from '../Information'
import BudgetItemExpandedTable from './BudgetItemExpandedTable'

type BudgetItemExpandedProps = {
    budgetItem: BudgetItem
    assigned: number
    balance: number
}

const BudgetItemExpandedButton = ({
    children,
}: {
    children: React.ReactNode
}) => {
    const { theme } = useTheme()
    const themeStyles =
        theme === 'LIGHT' ? 'bg-light text-light' : 'bg-dark text-dark'

    return (
        <button
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
    if (target === 0) {
        tip = 'Set a target for this item.'
    } else if (assigned !== target) {
        tip = `Assign $${(target - assigned).toFixed(
            2
        )} more to reach your target of $${target.toFixed(2)}.`
    } else if (assigned === target) {
        tip = `You've met your target! You have $${balance.toFixed(
            2
        )} left to spend.`
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
                    <BudgetItemExpandedButton>
                        Add Transaction
                        <Icon type="currency-dollar" />
                    </BudgetItemExpandedButton>
                    <BudgetItemExpandedButton>
                        Assign money
                        <Icon type="plus-circle" />
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
