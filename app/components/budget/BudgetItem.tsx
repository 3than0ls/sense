import { useState } from 'react'
import BudgetItemBar from './BudgetItemBar'
import Icon from '../icons/Icon'
import BudgetItemExpanded from './BudgetItemExpanded'
import { Link } from '@remix-run/react'
import { FullBudgetDataType } from '~/prisma/fullBudgetData'
import {
    totalAssignments,
    totalBudgetItemTransactions,
} from '~/utils/budgetValues'
import ThreeValues from './ThreeValues'
import { useTheme } from '~/context/ThemeContext'
import { BudgetItem as BudgetItemT } from '@prisma/client'

type BudgetItemProps = {
    budgetItem: FullBudgetDataType['budgetCategories'][number]['budgetItems'][number]
}

const LinkWrapper = ({
    children,
    budgetItem,
    className,
}: {
    children: React.ReactNode
    budgetItem: Pick<BudgetItemT, 'budgetCategoryId' | 'id'>
    className?: string
}) => {
    return (
        <Link
            className={className}
            to={`${budgetItem.budgetCategoryId}/${budgetItem.id}`}
        >
            {children}
        </Link>
    )
}

const BudgetItem = ({ budgetItem }: BudgetItemProps) => {
    const { name, target } = budgetItem
    const [expanded, setExpanded] = useState(false)

    const transactions = totalBudgetItemTransactions(budgetItem.transactions)
    const assigned = totalAssignments(budgetItem.assignments)
    const balance = assigned - transactions

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
                            balance={balance}
                            target={target}
                            assigned={assigned}
                        />
                    </button>
                </LinkWrapper>
                <ThreeValues
                    balance={balance}
                    assigned={assigned}
                    budgetItem={budgetItem}
                />
            </div>
            {expanded && (
                <BudgetItemExpanded
                    budgetItem={budgetItem}
                    assigned={assigned}
                    balance={balance}
                />
            )}
        </div>
    )
}

export default BudgetItem
