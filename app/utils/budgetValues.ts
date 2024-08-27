import { Account, Assignment, Transaction } from '@prisma/client'

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
 *  TODO
 */
export function accountTotalTransactions(transactions: Transaction[]) {
    transactions
    // _sum_amount(transactions)
}

/**
 * Intended to calculate the total amount of cash in a budget, based off it's accounts.
 * @param accounts An array of accounts in one singular budget
 * @returns The total cash of a budget
 */
export function budgetTotalAccounts(accounts: Account[]) {
    return accounts.reduce((accum, account) => {
        return accum + account.initialBalance
    }, 0)
}

/**
 * Intended to calculate the total amount of cash assigned in a budget, which is
 * then subtracted from total cash in a budget to make free cash to be assigned.
 * @param assignments An array of assignments in one singular budget
 * @returns Total assignments
 */
export function budgetTotalAssignments(assignments: Assignment[]) {
    return _sum_amount(assignments)
}

/**
 * Intended to calculate the total amount assigned to a budget item.
 * Reduces an array of assignments to a single value, the assigned value.
 * Presumably, all assignments are between the same budget and item, but this isn't checked.
 * @param assignments An array of assignments in one singular budget for one singular budget item
 * @returns The amount assigned to a budget item
 */
export function budgetItemTotalAssignments(assignments: Assignment[]) {
    return _sum_amount(assignments)
}

/**
 *  Intended to calculate the total transactions involving a budget item.
 *  Then subtracted from a budget item's assigned amount to produce the balance.
 * @param transactions An array of transactions in one singular budget for one singular budget item
 * @returns The amount transacted from a budget item
 */
export function budgetItemTotalTransactions(transactions: Transaction[]) {
    return _sum_amount(transactions)
}
