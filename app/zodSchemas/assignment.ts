import { z } from 'zod'
import numberSchema from './number'

export const assignmentSchema = z.object({
    targetBudgetItemId: z.string().uuid(),
    fromFreeCash: z.string().transform((value) => {
        if (value === 'true') return true
        if (value === 'false') return false
        // look- I know there's some zod way to use transform context to add the error in event a safeparse is needed
        // but I really don't care enough here.
        throw new Error('Invalid boolean string')
    }),
    fromBudgetItemId: z.string().uuid().or(z.literal('')),
    amount: numberSchema,
})
