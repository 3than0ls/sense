import { BudgetItem as BudgetItemModel } from '@prisma/client'
import { useState } from 'react'
import BudgetItemBar from './BudgetItemBar'
import Icon from '../icons/Icon'
import BudgetItemExpanded from './BudgetItemExpanded'
import { Link } from '@remix-run/react'

type BudgetItemProps = {
    budgetItem: BudgetItemModel
}

const BudgetItem = ({ budgetItem }: BudgetItemProps) => {
    const { name, balance, target, assigned } = budgetItem
    const [expanded, setExpanded] = useState(false)

    // ideas for the progress bar that will definitely be put in it's own component:
    // drag the assigned and balance ends to automatically set assigned and balance categories

    // alternative design choice: have own flex-box column for editing, making it fixed not hover

    return (
        <div>
            <div className="flex flex-row items-center gap-4 min-h-10 px-4">
                <div className="text-lg leading-snug w-56 flex gap-2">
                    <button
                        className={`flex items-center text-left gap-2 hover:opacity-80 transition`}
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
                    <Link
                        to={`${budgetItem.budgetCategoryId}/${budgetItem.id}`}
                        className="group hover:opacity-85 transition flex justify-center items-center overflow-hidden"
                    >
                        {name}
                        <Icon
                            type="edit"
                            className={`size-6 stroke-subtle hover:brightness-125 transform translate-y-16 group-hover:translate-y-0 transition ml-2`}
                            interactive
                        />
                    </Link>
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
