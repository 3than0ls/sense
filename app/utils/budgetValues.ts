import { Assignment, BudgetItem, Transaction } from '@prisma/client'
import { FullBudgetDataType } from '../prisma/fullBudgetData'

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

/**
 * Intended to calculate the total amount of cash in a budget, based off it's accounts.
 * @param accounts An array of accounts in one singular budget
 * @returns The total cash of a budget
 */
export function budgetTotalAccounts(budgetData: {
    accounts: {
        initialBalance: number
    }[]
}) {
    return budgetData.accounts.reduce((accum, account) => {
        return accum + account.initialBalance
    }, 0)
}

/**
 * Calculates the total dollar of transactions a budget has with, given a budgetData with FullBudgetDataType
 */
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

/**
 * Calculates the total dollar of assignments a budget has, given a budgetData with FullBudgetDataType
 */
export function budgetTotalAssignments(budgetData: {
    budgetCategories: {
        budgetItems: {
            assignments: Assignment[]
        }[]
    }[]
}) {
    return budgetData.budgetCategories.reduce((catAccum, cat) => {
        return (
            catAccum +
            cat.budgetItems.reduce((itemAccum, item) => {
                return itemAccum + assignedAmount(item)
                // return itemAccum + totalAssignments(item.assignments)
            }, 0)
        )
    }, 0)
}

/**
 * Calculates the total dollar of transactions a budget has in transactions without a budgetItemId, given a budgetData with FullBudgetDataType
 */
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

/**
 *  Intended to calculate the total assignments of any sort of list of assignments
 * @param assignments An array of assignments in one singular budget or for one singular budget item
 * @param assignments An array of assignments in one singular budget for one singular budget item
 * @returns The amount assigned to a budget item
 */
export function totalAssignments(
    assignments: {
        amount: number
    }[]
) {
    return _sum_amount(assignments)
}

/**
 *  Intended to calculate the total transactions of any sort of list of transactions
 * @param transactions An array of transactions in one singular budget or for one singular budget item
 * @returns The amount transacted from a budget item
 */
export function totalTransactions(transactions: Transaction[]) {
    return _sum_amount(transactions)
}

export function assignedAmount(budgetItem: {
    assignments: Pick<Assignment, 'amount'>[]
}) {
    if (budgetItem.assignments.length === 0) {
        return 0
    } else {
        return budgetItem.assignments[0].amount
    }
}
