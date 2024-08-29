import { BudgetItem } from '@prisma/client'
import BudgetItemBarExpanded from './BudgetItemBarExpanded'
import { useTheme } from '~/context/ThemeContext'

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
    const themeStyles = theme === 'LIGHT' ? 'border-dark' : 'border-light'

    return (
        <button
            className={`text-lg font-work-bold w-full rounded-xl h-12 transition ${themeStyles} border-2 bg-opacity-0 bg-primary hover:bg-opacity-40`}
        >
            {children}
        </button>
    )
}

const BudgetItemExpanded = ({
    budgetItem: { name, target },
    assigned = 999,
    balance = 999,
}: BudgetItemExpandedProps) => {
    // add some add and edit buttons yeah?

    return (
        <div className="w-full py-4 flex flex-col">
            <BudgetItemBarExpanded
                assigned={assigned}
                balance={balance}
                target={target}
            />
            <div className="flex gap-10 py-4 px-10 mt-2">
                <div className="flex flex-col w-2/3">
                    <span className="text-lg">
                        Perhaps a little bit of information about this budgeted
                        item
                    </span>
                    <span className="text-subtle">
                        And maybe some transaction history here that can be
                        expanded further to see all.
                    </span>
                </div>
                <div className="flex flex-col gap-5 w-1/3">
                    <BudgetItemExpandedButton>
                        Add Transaction
                    </BudgetItemExpandedButton>
                    <BudgetItemExpandedButton>
                        Assign money
                    </BudgetItemExpandedButton>
                </div>
            </div>
        </div>
    )
}

export default BudgetItemExpanded
