import { useState } from 'react'
import BudgetItemBar from './BudgetItemBar'
import Icon from '../icons/Icon'
import BudgetItemExpanded from './BudgetItemExpanded'
import { Link } from '@remix-run/react'
import { FullBudgetType } from '~/prisma/fullBudgetData'
import {
    budgetItemCurrentMonthAssignedAmount,
    budgetItemCurrentMonthTransactionAmount,
} from '~/utils/budgetValues'
import ThreeValues from './ThreeValues'
import { useTheme } from '~/context/ThemeContext'
import { useFindRelation } from '~/context/BudgetDataContext'
import { useBudgetUX } from '~/context/BudgetUXContext'

type BudgetItemProps = {
    budgetItem: FullBudgetType['budgetItems'][number]
}

const LinkWrapper = ({
    children,
    budgetItem,
    className,
}: {
    children: React.ReactNode
    budgetItem: FullBudgetType['budgetItems'][number]
    className?: string
    searchParams?: string
}) => {
    const { updateBudgetUX } = useBudgetUX()

    const onClick = () => {
        updateBudgetUX({
            focus: 'itname',
        })
    }
    const link = `/budget/${budgetItem.budgetId}/i/${budgetItem.id}`
    return (
        <Link className={className} onClick={onClick} to={link}>
            {children}
        </Link>
    )
}

const BudgetItem = ({ budgetItem }: BudgetItemProps) => {
    const { name, target } = budgetItem
    const [expanded, setExpanded] = useState(false)

    const transactions = useFindRelation(
        'transactions',
        'budgetItemId',
        budgetItem.id
    )
    const assignments = useFindRelation(
        'assignments',
        'budgetItemId',
        budgetItem.id
    )

    const currentMonthTransactions =
        budgetItemCurrentMonthTransactionAmount(transactions)
    const currentMonthAssignment =
        budgetItemCurrentMonthAssignedAmount(assignments)
    const currentMonthBalance =
        currentMonthAssignment + currentMonthTransactions

    // ideas for the progress bar that will definitely be put in it's own component:
    // drag the assigned and balance ends to automatically set assigned and balance categories

    // alternative design choice: have own flex-box column for editing, making it fixed not hover

    const { theme } = useTheme()
    const hoverThemeStyle =
        theme === 'DARK' ? 'hover:stroke-light' : 'hover:stroke-dark'

    return (
        <div>
            <div className="flex flex-row items-center gap-4 min-h-10 px-3 w-full">
                <div
                    className={`text-lg leading-snug ${
                        expanded ? 'mr-auto' : 'mr-auto'
                    } flex gap-2 max-w-80 xl:max-w-96 2xl:max-w-none 2xl:w-1/2 2xl:overflow-hidden`}
                >
                    <button
                        className={`flex items-center truncate text-left gap-2 hover:opacity-80 transition`}
                        onClick={() => setExpanded(!expanded)}
                    >
                        <Icon
                            type="chevron-down"
                            // type={expanded ? 'chevron-up' : 'chevron-down'}
                            className={`size-[18px] transform ${
                                expanded && '-rotate-180'
                            } transition`}
                        />
                    </button>
                    <LinkWrapper
                        budgetItem={budgetItem}
                        className="w-full group hover:opacity-85 transition flex items-center overflow-hidden"
                    >
                        <span className="w-fit truncate">{name}</span>
                        <Icon
                            type="edit"
                            className={`size-6 stroke-subtle ${hoverThemeStyle} transform translate-y-16 group-hover:translate-y-0 transition ml-2`}
                            interactive
                        />
                    </LinkWrapper>
                </div>
                <LinkWrapper
                    budgetItem={budgetItem}
                    className={`hidden ${
                        expanded ? '2xl:hidden' : '2xl:block'
                    } 2xl:flex-grow 2xl:w-1/2`}
                >
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="w-full"
                    >
                        <BudgetItemBar
                            expanded={expanded}
                            balance={currentMonthBalance}
                            target={target}
                            assigned={currentMonthAssignment}
                        />
                    </button>
                </LinkWrapper>
                <ThreeValues
                    balance={currentMonthBalance}
                    assigned={currentMonthAssignment}
                    budgetItem={budgetItem}
                />
            </div>
            {expanded && (
                <BudgetItemExpanded
                    budgetItem={budgetItem}
                    assigned={currentMonthAssignment}
                    balance={currentMonthBalance}
                />
            )}
        </div>
    )
}

export default BudgetItem
