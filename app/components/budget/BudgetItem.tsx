import { BudgetItem as BudgetItemModel } from '@prisma/client'
import React, { useState } from 'react'
import BudgetItemBar from './BudgetItemBar'
import Icon from '../icons/Icon'
import BudgetItemExpanded from './BudgetItemExpanded'

type BudgetItemProps = {
    budgetItem: BudgetItemModel
}

const BudgetItem = ({ budgetItem }: BudgetItemProps) => {
    const { name, balance, target, assigned } = budgetItem
    const [expanded, setExpanded] = useState(false)

    const balanceTranslation = -(100 - (balance / target) * 100)
    const assignedTranslation = -(100 - 70)

    // ideas for the progress bar that will definitely be put in it's own component:
    // drag the assigned and balance ends to automatically set assigned and balance categories

    return (
        <div>
            <tr className="flex flex-row items-center gap-4 min-h-10 px-4">
                <td className="text-lg leading-snug w-56">
                    <button
                        className={`flex items-center text- gap-2`}
                        onClick={() => setExpanded(!expanded)}
                    >
                        <Icon
                            type={expanded ? 'chevron-up' : 'chevron-down'}
                            className="size-[18px]"
                        />
                        {name}
                    </button>
                </td>
                <td className="flex-grow">
                    <BudgetItemBar
                        expanded={expanded}
                        balance={balance}
                        target={target}
                        assigned={assigned}
                    />
                </td>
                <td className="w-32 text-right">
                    <span>${balance.toFixed(2)}</span>
                </td>
                <td className="w-32 text-right">
                    <span>${assigned.toFixed(2)}</span>
                </td>
                <td className="w-32 text-right">
                    <span>${target.toFixed(2)}</span>
                </td>
            </tr>
            {expanded && <BudgetItemExpanded budgetItem={budgetItem} />}
        </div>
    )
}

export default BudgetItem
