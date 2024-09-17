import { Assignment, Transaction } from '@prisma/client'
import { FullBudgetDataType } from '../prisma/fullBudgetData'
import { FullAccountDataType } from '~/prisma/fullAccountData'
import getStartOfMonth from './getStartOfMonth'

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

export function budgetTotalAccounts(budgetData: {
    accounts: {
        initialBalance: number
    }[]
}) {
    return budgetData.accounts.reduce((accum, account) => {
        return accum + account.initialBalance
    }, 0)
}

export function budgetValues(budgetData: FullBudgetDataType) {
    let totalAccountInitialBalance = 0
    let totalBudgetItemTransactions = 0
    let totalFreeCashTransactions = 0
    let totalTransactions = 0
    let currentMonthBudgetItemTransactions = 0
    let pastMonthBudgetItemTransactions = 0

    const currentMonth = getStartOfMonth()

    for (const account of budgetData.accounts) {
        totalAccountInitialBalance += account.initialBalance
        for (const transaction of account.transactions) {
            if (transaction.budgetItemId === null) {
                totalFreeCashTransactions += transaction.amount
            } else {
                totalBudgetItemTransactions += transaction.amount
                if (new Date(transaction.date) > currentMonth) {
                    currentMonthBudgetItemTransactions += transaction.amount
                } else {
                    pastMonthBudgetItemTransactions += transaction.amount
                }
            }
        }
    }

    totalTransactions = totalFreeCashTransactions + totalBudgetItemTransactions

    return {
        totalAccountInitialBalance,
        totalBudgetItemTransactions,
        totalFreeCashTransactions,
        totalTransactions,
        currentMonthBudgetItemTransactions,
        pastMonthBudgetItemTransactions,
        totalAssignments: budgetTotalAssignments(budgetData),
    }
}

export function flattenTransactions(budgetData: FullBudgetDataType) {
    return budgetData.accounts.flatMap((account) => account.transactions)
}

export function budgetTotalAssignments(budgetData: FullBudgetDataType) {
    return budgetData.budgetCategories.reduce((catAccum, cat) => {
        return (
            catAccum +
            cat.budgetItems.reduce((itemAccum, item) => {
                return itemAccum + budgetItemCurrentMonthAssignedAmount(item)
            }, 0)
        )
    }, 0)
}

// *********************************************************************
// FUNCTIONS CONCERNING CALCULATING VALUES FOR A SINGULAR BUDGET ITEM
// *******************************************************************

export function budgetItemCurrentMonthTransactionAmount(budgetItem: {
    transactions: Pick<Transaction, 'amount' | 'date'>[]
}) {
    const start = getStartOfMonth()
    return _sum_amount(
        budgetItem.transactions.filter((t) => {
            return new Date(t.date) > start
        })
    )
}

export function budgetItemCurrentMonthAssignedAmount(budgetItem: {
    assignments: Pick<Assignment, 'amount'>[]
}) {
    if (budgetItem.assignments.length === 0) {
        return 0
    } else {
        return budgetItem.assignments[0].amount
    }
}

// *********************************************************************
// FUNCTIONS CONCERNING CALCULATING VALUES FROM AN ACCOUNT AS A WHOLE
// *******************************************************************

export function accountTotalTransactions(accountData: FullAccountDataType) {
    return accountData.transactions.reduce((accum, transac) => {
        return accum + transac.amount
    }, 0)
}
