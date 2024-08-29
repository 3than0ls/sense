import { z } from 'zod'
import numberSchema from './number'

export const accountFormSchema = z.object({
    name: z
        .string()
        .min(1, 'Account name cannot be empty')
        .max(60, 'Account name too long.'),
    initialBalance: numberSchema,
})
export type AccountFormSchemaType = z.infer<typeof accountFormSchema>

export const accountSchema = accountFormSchema.extend({
    budgetId: z.string().uuid(),
})
