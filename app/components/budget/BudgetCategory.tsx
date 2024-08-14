import React from 'react'
import { BudgetCategoryFullType } from '~/context/BudgetContext'
import BudgetItem from './BudgetItem'
import { useTheme, useThemeClass } from '~/context/ThemeContext'

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

    const { theme } = useTheme()
    const themeStyle = theme === 'LIGHT' ? 'bg-dark' : 'bg-light'

    return (
        <>
            <tr className="px-4 flex items-center min-h-10 border-collapse">
                <span className="font-work-bold text-xl">
                    {budgetCategory.name}
                </span>
            </tr>
            {/* <hr className={`border-none h-[4px] ${themeStyle} mb-2`} /> */}
            {...budgetItemComponents}
        </>
    )
}

export default BudgetCategory
