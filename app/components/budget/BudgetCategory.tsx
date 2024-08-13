import React from 'react'
import { BudgetCategoryFullType } from '~/context/BudgetContext'
import BudgetItem from './BudgetItem'

type BudgetCategoryProps = {
    budgetCategory: BudgetCategoryFullType
}

const BudgetCategory = ({ budgetCategory }: BudgetCategoryProps) => {
    const budgetItemComponents = Array.from(
        budgetCategory.budgetItems,
        (budgetItem) => {
            return <BudgetItem budgetItem={budgetItem} key={budgetItem.id} />
        }
    )

    return (
        <div>
            <span>{budgetCategory.name}</span>
            {...budgetItemComponents}
        </div>
    )
}

export default BudgetCategory
