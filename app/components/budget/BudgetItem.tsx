import { useState } from 'react'
import BudgetItemBar from './BudgetItemBar'
import Icon from '../icons/Icon'
import BudgetItemExpanded from './BudgetItemExpanded'
import { Link } from '@remix-run/react'
import { FullBudgetDataType } from '~/prisma/fullBudgetData'
import { totalAssignments, totalTransactions } from '~/utils/budgetValues'
import ThreeValues from './ThreeValues'
import { useTheme } from '~/context/ThemeContext'

type BudgetItemProps = {
    budgetItem: FullBudgetDataType['budgetCategories'][number]['budgetItems'][number]
}

const BudgetItem = ({ budgetItem }: BudgetItemProps) => {
    const { name, target } = budgetItem
    const [expanded, setExpanded] = useState(false)

    const transactions = totalTransactions(budgetItem.transactions)
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
            <div className="flex flex-row items-center gap-4 min-h-10 px-4">
                <div
                    className={`text-lg leading-snug ${
                        expanded ? 'flex-grow max-w-96' : 'w-64'
                    } flex gap-2`}
                >
                    <button
                        className={`flex items-center max-w-full text-left gap-2 hover:opacity-80 transition`}
                        onClick={() => setExpanded(!expanded)}
                    >
                        <Icon
                            type="chevron-down"
                            // type={expanded ? 'chevron-up' : 'chevron-down'}
                            className={`size-[18px] transform ${
                                expanded && '-rotate-180'
                            } transition`}
                        />
                        <Link
                            to={`${budgetItem.budgetCategoryId}/${budgetItem.id}`}
                            className="w-full group hover:opacity-85 transition flex justify-center items-center overflow-hidden"
                        >
                            <span className="w-full truncate">{name}</span>
                            <Icon
                                type="edit"
                                className={`size-6 stroke-subtle ${hoverThemeStyle} transform translate-y-16 group-hover:translate-y-0 transition ml-2`}
                                interactive
                            />
                        </Link>
                    </button>
                </div>
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="flex-grow"
                >
                    <BudgetItemBar
                        expanded={expanded}
                        balance={balance}
                        target={target}
                        assigned={assigned}
                    />
                </button>
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
