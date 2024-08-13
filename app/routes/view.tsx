import type {
    Budget as BudgetT,
    BudgetCategory,
    BudgetItem,
} from '@prisma/client'
import { LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import Budget from '~/components/budget/Budget'
import { BudgetFullType } from '~/context/BudgetContext'
import prisma from '~/prisma/client'

export async function loader(request: LoaderFunctionArgs) {
    const budget: BudgetT = {
        createdAt: new Date(),
        description: 'a budget to save money',
        id: 'abcdef',
        name: 'money saving budget',
        userId: 'some user',
    }

    const cats: BudgetCategory[] = [
        {
            budgetId: 'abcdef',
            createdAt: new Date(),
            id: 'a',
            name: 'Personal',
        },
        {
            budgetId: 'abcdef',
            createdAt: new Date(),
            id: 'b',
            name: 'Bills',
        },
        {
            budgetId: 'abcdef',
            createdAt: new Date(),
            id: 'c',
            name: 'Car',
        },
    ]

    type temp = {
        budgetItems: BudgetItem[]
    } & BudgetCategory
    const budgetCategories = cats as temp[]
    budgetCategories[0].budgetItems = [
        {
            id: 'aa',
            balance: 50,
            target: 100,
            createdAt: new Date(),
            name: 'Gym',
            budgetCategoryId: 'a',
        },
        {
            id: 'ab',
            balance: 100,
            target: 100,
            createdAt: new Date(),
            name: 'Drugs',
            budgetCategoryId: 'a',
        },
    ]
    budgetCategories[1].budgetItems = [
        {
            id: 'ba',
            balance: 0,
            target: 200,
            createdAt: new Date(),
            name: 'Water',
            budgetCategoryId: 'b',
        },
        {
            id: 'bb',
            balance: 32.4,
            target: 125,
            createdAt: new Date(),
            name: 'Electricity',
            budgetCategoryId: 'b',
        },
        {
            id: 'bc',
            balance: 5,
            target: 10,
            createdAt: new Date(),
            name: 'Streaming service',
            budgetCategoryId: 'b',
        },
    ]
    budgetCategories[2].budgetItems = [
        {
            id: 'ca',
            balance: 15,
            target: 1000,
            createdAt: new Date(),
            name: 'Gas',
            budgetCategoryId: 'c',
        },
    ]

    const returnType: BudgetFullType = {
        ...budget,
        budgetCategories,
    }

    return returnType
}

export default function View() {
    const data = useLoaderData<typeof loader>()

    return <Budget budgetData={data as unknown as BudgetFullType} />
}
