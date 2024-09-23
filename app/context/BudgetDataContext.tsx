import React, { useContext, createContext } from 'react'
import { FullBudgetType } from '~/prisma/fullBudgetData'

type BudgetDataProviderProps = {
    budgetData: FullBudgetType
    children: React.ReactNode
}

type BudgetDataContextType = {
    clientBudgetData: FullBudgetType
    // setClientBudgetData: React.Dispatch<React.SetStateAction<FullBudgetType>>
    // updateClientBudgetData: React.Dispatch<React.SetStateAction<FullBudgetType>>
    // TODO: some calculated values used in BudgetMenu
} | null

const BudgetDataContext = createContext<BudgetDataContextType>(null)

export const BudgetDataProvider = ({
    budgetData,
    children,
}: BudgetDataProviderProps) => {
    return (
        <BudgetDataContext.Provider
            value={{
                clientBudgetData: budgetData,
            }}
        >
            {children}
        </BudgetDataContext.Provider>
    )
}

export const useBudgetData = () => {
    // assumes no funny business is happening and no one is trying to useBudgetData outside of context
    return useContext(BudgetDataContext)!.clientBudgetData
}

type KeysToArrays = {
    [K in keyof FullBudgetType]: FullBudgetType[K] extends unknown[] ? K : never
}[keyof FullBudgetType]

export function findRelationInBudgetData<
    Model extends KeysToArrays,
    Property extends keyof FullBudgetType[Model][number]
>(budgetData: FullBudgetType, model: Model, idProperty: Property, id: string) {
    // playing with fire here
    // but it SHOULD work regardless
    return (budgetData[model] as never[]).filter((xyz) => {
        return idProperty in xyz && xyz[idProperty] === id
    }) as FullBudgetType[Model]
}

/**
 * A shitty version of a WHERE search. I don't know! Search for models that has an [idProperty] that equals id.
 * Ex: Search for all BudgetItems that have a budgetId of 123-456
 *
 * Intends to make budget data accessible from EVERY child component, extremely helpful.
 */
export function useFindRelation<
    Model extends KeysToArrays,
    Property extends keyof FullBudgetType[Model][number]
>(model: Model, idProperty: Property, id: string) {
    const budgetData = useBudgetData()

    return findRelationInBudgetData(budgetData, model, idProperty, id)
}
