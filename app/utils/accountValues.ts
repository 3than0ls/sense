import { Assignment, Transaction } from '@prisma/client'
import { FullBudgetDataType } from '../prisma/fullBudgetData'
import { FullAccountDataType } from '~/prisma/fullAccountData'

/**
 * Essentialyl a copy paste of budgetValues, created to determine values for the account.
 * Specifically, looking for total transactions given a list of transactions.
 *
 *
 *
 * All of these functions are trusting and assuming the user of the function
 * Passes in correct data. At it's core, they all do the same thing; reduce an array.
 * It's assumed the array contains the correct data, not only by type, but by the actual data relations inside it too.
 * It will NOT fail if there are discrepancies in input data.
 * Checks could be added but that's too much work, and Prisma queries are built in a way
 * that you'd really have to be trying to mess up in order to make that mistake
 */

export function accountTotalTransactions(accountData: FullAccountDataType) {
    return accountData.transactions.reduce((accum, transac) => {
        return accum + transac.amount
    }, 0)
}
