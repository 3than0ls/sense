import { useSearchParams } from '@remix-run/react'
import React, { useContext, createContext, useState } from 'react'

/**
 *
 * Aims to be a general solution to solve focusing the user input on BudgetMenu inputs without having to page refresh
 *
 * But can accomodate any settings related to UX in the Budget route.
 *
 */

type BudgetUXProps = {
    children: React.ReactNode
}

const focusValues = [null, 'itname', 'catname', 'assign', 'target'] as const

type BudgetUXType = { focus: (typeof focusValues)[number] }

type BudgetUXContextType = {
    budgetUX: BudgetUXType
    updateBudgetUX: React.Dispatch<React.SetStateAction<BudgetUXType>>
} | null

const BudgetUX = createContext<BudgetUXContextType>(null)

export const BudgetUXProvider = ({ children }: BudgetUXProps) => {
    const [searchParams] = useSearchParams()
    let defaultFocus = null
    if (focusValues.includes(searchParams.get('f') as never)) {
        defaultFocus = searchParams.get('f') as (typeof focusValues)[number]
    }

    const [budgetUX, _setBudgetUX] = useState<BudgetUXType>({
        focus: defaultFocus,
    })

    const updateBudgetUX: React.Dispatch<React.SetStateAction<BudgetUXType>> = (
        values
    ) => {
        _setBudgetUX({ ...budgetUX, ...values })
    }

    return (
        <BudgetUX.Provider value={{ budgetUX, updateBudgetUX: updateBudgetUX }}>
            {children}
        </BudgetUX.Provider>
    )
}

export const useBudgetUX = () => {
    return useContext(BudgetUX)!
}
