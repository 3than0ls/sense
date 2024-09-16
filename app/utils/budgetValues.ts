import { Assignment, Transaction } from '@prisma/client'
import { FullBudgetDataType } from '../prisma/fullBudgetData'
import { FullAccountDataType } from '~/prisma/fullAccountData'

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

export function totalBudgetItemTransactions(budgetData: FullBudgetDataType) {
    // all the transactions associated with budgetItems, plus the ones that are not
    return budgetData.budgetCategories.reduce((catAccum, cat) => {
        return (
            catAccum +
            cat.budgetItems.reduce((itemAccum, item) => {
                return (
                    itemAccum +
                    item.transactions.reduce((transacAccum, transac) => {
                        return transacAccum + transac.amount
                    }, 0)
                )
            }, 0)
        )
    }, 0)
}

export function totalFreeCashTransactions(budgetData: FullBudgetDataType) {
    return budgetData.accounts.reduce((accountAccum, account) => {
        return (
            accountAccum +
            account.transactions.reduce((transacAccum, transac) => {
                return transacAccum + transac.amount
            }, 0)
        )
    }, 0)
}

export function budgetTotalTransactions(budgetData: FullBudgetDataType) {
    return (
        totalFreeCashTransactions(budgetData) +
        totalBudgetItemTransactions(budgetData)
    )
}

export function budgetTotalAssignments(budgetData: FullBudgetDataType) {
    return budgetData.budgetCategories.reduce((catAccum, cat) => {
        return (
            catAccum +
            cat.budgetItems.reduce((itemAccum, item) => {
                return itemAccum + budgetItemAssignedAmount(item)
            }, 0)
        )
    }, 0)
}

// *********************************************************************
// FUNCTIONS CONCERNING CALCULATING VALUES FOR A SINGULAR BUDGET ITEM
// *******************************************************************

export function budgetItemTransactionsAmount(budgetItem: {
    transactions: Pick<Transaction, 'amount'>[]
}) {
    return _sum_amount(budgetItem.transactions)
}

export function budgetItemAssignedAmount(budgetItem: {
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
