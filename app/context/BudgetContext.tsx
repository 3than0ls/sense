import { Budget, BudgetCategory, BudgetItem } from '@prisma/client'
import React, { useContext, createContext } from 'react'

// establish some helpful types
export type BudgetCategoryFullType = BudgetCategory & {
    budgetItems: BudgetItem[]
}

export type BudgetFullType = Budget & {
    budgetCategories: BudgetCategoryFullType[]
}
// the above types are just the prisma model's along with their relations

type BudgetProviderProps = {
    budgetData: BudgetFullType
    children: React.ReactNode
}

const BudgetContext = createContext<BudgetFullType | null>(null)

const BudgetProvider = ({ budgetData, children }: BudgetProviderProps) => {
    // rather than using a state, the data provided by BudgetProvider should originate from a useLoaderData
    // it should only be set once, on load, from useLoaderData
    return (
        <BudgetContext.Provider value={budgetData}>
            {children}
        </BudgetContext.Provider>
    )
}

export const useBudget = (): BudgetFullType => {
    const data = useContext(BudgetContext)
    if (data === null) {
        throw new Error(
            'Budget data from BudgetProvider is null. You likely did not load it in correctly.'
        )
    }
    return data
}

export default BudgetProvider
