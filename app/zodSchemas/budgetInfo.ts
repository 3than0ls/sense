import { z } from 'zod'

export const budgetInfoFormSchema = z.object({
    name: z
        .string()
        .min(1, 'Budget name cannot be empty.')
        .max(100, 'Budget name too long.'),
    description: z
        .string()
        .min(1, 'Budget description cannot be empty.')
        .max(500, 'Budget description too long.'),
})

export const budgetInfoSchema = budgetInfoFormSchema.extend({
    budgetId: z.string().uuid(),
})
