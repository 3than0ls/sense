import { z } from 'zod'

export const budgetSchema = z.object({
    name: z
        .string()
        .min(1, 'Budget name cannot be empty.')
        .max(100, 'Budget name too long.'),
    description: z.string().max(500, 'Budget description too long.'),
})

export const updateBudgetSchema = budgetSchema.extend({
    budgetId: z.string().uuid(),
})
