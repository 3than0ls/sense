import { z } from 'zod'
import numberSchema from './number'

export const transactionFormSchema = z.object({
    amount: numberSchema,
    description: z.string().max(500, 'Transaction description too long.'),
})

export const transactionSchema = transactionFormSchema.extend({
    budgetItemId: z.string().uuid(),
    accountId: z.string().uuid(),
})

export const updateTransactionSchema = transactionSchema.extend({
    transactionId: z.string().uuid(),
})
