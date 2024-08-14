import { BudgetItem as BudgetItemModel } from '@prisma/client'
import { useState } from 'react'
import BudgetItemBar from './BudgetItemBar'
import Icon from '../icons/Icon'
import BudgetItemExpanded from './BudgetItemExpanded'
import { useTheme } from '~/context/ThemeContext'

type BudgetItemProps = {
    budgetItem: BudgetItemModel
}

const BudgetItem = ({ budgetItem }: BudgetItemProps) => {
    const { name, balance, target, assigned } = budgetItem
    const [expanded, setExpanded] = useState(false)

    // ideas for the progress bar that will definitely be put in it's own component:
    // drag the assigned and balance ends to automatically set assigned and balance categories

    const { theme } = useTheme()

    return (
        <div>
            <div className="flex flex-row items-center gap-4 min-h-10 px-4">
                <div className="text-lg leading-snug w-56">
                    <button
                        className={`flex items-center text-left gap-2 hover:opacity-85 transition`}
                        onClick={() => setExpanded(!expanded)}
                    >
                        <Icon
                            type="chevron-down"
                            // type={expanded ? 'chevron-up' : 'chevron-down'}
                            className={`size-[18px] transform ${
                                expanded && '-rotate-180'
                            } transition`}
                        />
                        {name}
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
                <span className="w-32 text-right">${balance.toFixed(2)}</span>
                <span className="w-32 text-right">${assigned.toFixed(2)}</span>
                <span className="w-32 text-right">${target.toFixed(2)}</span>
            </div>
            {expanded && <BudgetItemExpanded budgetItem={budgetItem} />}
        </div>
    )
}

export default BudgetItem
