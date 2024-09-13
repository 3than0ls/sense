import { z } from 'zod'
import numberSchema from './number'

export const transactionFormSchema = z.object({
    amount: numberSchema,
    description: z.string().max(500, 'Transaction description too long.'),
})
export type TransactionFormSchemaType = z.infer<typeof transactionFormSchema>

export const transactionSchema = transactionFormSchema.extend({
    budgetItemId: z.string().uuid().or(z.literal('')),
    accountId: z.string().uuid(),
    transactionFlow: z.literal('inflow').or(z.literal('outflow')),
})

export const updateTransactionSchema = transactionSchema.extend({
    transactionId: z.string().uuid(),
})
