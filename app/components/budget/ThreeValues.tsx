import { useModal } from '~/context/ModalContext'
import AssignMoneyForm from './AssignMoneyForm'
import { BudgetItem } from '@prisma/client'

type ThreeValuesProps = {
    balance: number
    assigned: number
    budgetItem: BudgetItem
}

const ThreeValues = ({ balance, assigned, budgetItem }: ThreeValuesProps) => {
    const { setModalTitle, setModalChildren, setActive } = useModal()
    const onAssignMoneyClick = () => {
        setModalTitle(`Assign Money to ${budgetItem.name}`)
        setModalChildren(
            <AssignMoneyForm
                targetBudgetItem={budgetItem}
                targetBudgetItemAssigned={assigned}
            />
        )
        setActive(true)
    }

    return (
        <div className="flex items-center gap-4 min-h-10">
            <div className="w-24 flex justify-end items-center gap-2">
                <span className="text-right">{`$${balance.toFixed(2)}`}</span>
                <hr className="bg-balance border-0 aspect-square h-2 rounded-full" />
            </div>
            <button
                onClick={onAssignMoneyClick}
                className="w-24 flex justify-end items-center gap-2"
            >
                <span className="text-right">{`$${assigned.toFixed(2)}`}</span>
                <hr className="bg-assigned border-0 aspect-square h-2 rounded-full" />
            </button>
            <div className="w-24 flex justify-end items-center gap-2">
                <span className="text-right">{`$${budgetItem.target.toFixed(
                    2
                )}`}</span>
                <hr className="bg-target border-0 aspect-square h-2 rounded-full" />
            </div>
        </div>
    )
}

export default ThreeValues
