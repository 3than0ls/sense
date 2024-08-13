import { BudgetItem as BudgetItemModel } from '@prisma/client'
import React from 'react'

type BudgetItemProps = {
    budgetItem: BudgetItemModel
}

const BudgetItem = ({
    budgetItem: { name, balance, target },
}: BudgetItemProps) => {
    return (
        <div>
            <span>{name}</span>
            <span>
                {balance}/{target}
            </span>
        </div>
    )
}

export default BudgetItem
