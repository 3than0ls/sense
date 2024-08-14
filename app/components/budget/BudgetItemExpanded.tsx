import { BudgetItem } from '@prisma/client'
import BudgetItemBarExpanded from './BudgetItemBarExpanded'

type BudgetItemExpandedProps = {
    budgetItem: BudgetItem
}

const BudgetItemExpanded = ({
    budgetItem: { name, balance, target, assigned },
}: BudgetItemExpandedProps) => {
    return (
        <div className="w-full py-4 flex flex-col">
            <BudgetItemBarExpanded
                assigned={assigned}
                balance={balance}
                target={target}
            />
            <div className=""></div>
        </div>
    )
}

export default BudgetItemExpanded
