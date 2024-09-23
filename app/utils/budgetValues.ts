import { FullAccountType } from '~/prisma/fullAccountData'
import { FullBudgetType, ServerFullBudgetType } from '../prisma/fullBudgetData'
import getStartOfMonth from './getStartOfMonth'
import {
    CurrentMonthBudgetItemType,
    ServerCurrentMonthBudgetItemType,
} from '~/prisma/fullBudgetItemData'

/**
 * All of these functions are trusting and assuming the user of the function
 * Passes in correct data. At it's core, they all do the same thing; reduce an array.
 * It's assumed the array contains the correct data, not only by type, but by the actual data relations inside it too.
 * It will NOT fail if there are discrepancies in input data.
 * Checks could be added but that's too much work, and Prisma queries are built in a way
 * that you'd really have to be trying to mess up in order to make that mistake
 */

type _GenericType = {
    amount: number
}
function _sum_amount(x: _GenericType[]) {
    return x.reduce((accum, xi) => {
        return accum + xi.amount
    }, 0)
}

// *********************************************************************
// FUNCTIONS CONCERNING CALCULATING VALUES FROM BUDGET DATA AS A WHOLE
// *********************************************************************

export function currentMonthBudgetValues(
    budgetData: FullBudgetType | ServerFullBudgetType
) {
    // make single pass-throughs to calculate a wide variety of data
    const currentMonth = getStartOfMonth()
    const budgetItemDict: {
        [bItemId: string]: {
            assignedAmount: number
            transactionsAmount: number
        }
    } = {}
    const defineIfNotExist = (budgetItemId: string) => {
        if (!(budgetItemId in budgetItemDict)) {
            budgetItemDict[budgetItemId] = {
                transactionsAmount: 0,
                assignedAmount: 0,
            }
        }
        return budgetItemDict[budgetItemId]
    }

    let allAccountInitialBalance = 0
    let allTransactions = 0
    let toCurrentMonthBudgetItemTransactions = 0
    let currentMonthBudgetItemTransactions = 0
    let allFreeCashTransactions = 0

    for (const account of budgetData.accounts) {
        allAccountInitialBalance += account.initialBalance
    }

    for (const transac of budgetData.transactions) {
        if (transac.budgetItemId === null) {
            allFreeCashTransactions += transac.amount
        } else {
            defineIfNotExist(transac.budgetItemId).transactionsAmount +=
                transac.amount

            if (new Date(transac.date) < currentMonth) {
                currentMonthBudgetItemTransactions += transac.amount
            } else {
                toCurrentMonthBudgetItemTransactions += transac.amount
            }
        }
    }

    for (const assign of budgetData.assignments) {
        defineIfNotExist(assign.budgetItemId).assignedAmount = assign.amount
    }

    let adjustedTotalAssignments = 0

    for (const budgetItemData of Object.values(budgetItemDict)) {
        const { assignedAmount, transactionsAmount } = budgetItemData
        // TODO: MAY HAVE TO CHECK MATH AND REPLACE Math.abs(...) with -... IF TRANSACTION AMOUNT NET IS POSITIVE
        adjustedTotalAssignments += Math.max(
            Math.abs(transactionsAmount),
            assignedAmount
        )
        // if (assignedAmount + transactionsAmount < 0) {
        //     adjustedTotalAssignments += Math.abs(transactionsAmount)
        // } else {
        //     adjustedTotalAssignments += assignedAmount
        // }
    }

    allTransactions =
        allFreeCashTransactions +
        toCurrentMonthBudgetItemTransactions +
        currentMonthBudgetItemTransactions

    return {
        totalCash: allAccountInitialBalance + allTransactions,
        freeCash:
            allAccountInitialBalance +
            allFreeCashTransactions +
            toCurrentMonthBudgetItemTransactions -
            adjustedTotalAssignments,
    }
}

// *********************************************************************
// FUNCTIONS CONCERNING CALCULATING VALUES FOR A SINGULAR BUDGET ITEM
// *******************************************************************

export function budgetItemCurrentMonthTransactionAmount(
    transactions:
        | FullBudgetType['transactions']
        | ServerFullBudgetType['transactions']
        | CurrentMonthBudgetItemType['transactions']
        | ServerCurrentMonthBudgetItemType['transactions']
) {
    const start = getStartOfMonth()
    return _sum_amount(
        transactions.filter((t) => {
            return (t.date instanceof Date ? t.date : new Date(t.date)) > start
        })
    )
}

export function budgetItemCurrentMonthAssignedAmount(
    assignments:
        | FullBudgetType['assignments']
        | ServerFullBudgetType['assignments']
        | CurrentMonthBudgetItemType['assignments']
        | ServerCurrentMonthBudgetItemType['assignments']
) {
    if (assignments.length === 0) {
        return 0
    } else {
        return assignments[0].amount
    }
}

// *********************************************************************
// FUNCTIONS CONCERNING CALCULATING VALUES FROM AN ACCOUNT AS A WHOLE
// *******************************************************************

export function accountTotalTransactions(accountData: FullAccountType) {
    return accountData.transactions.reduce((accum, transac) => {
        return accum + transac.amount
    }, 0)
}
