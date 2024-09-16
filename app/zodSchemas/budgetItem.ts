import { z } from 'zod'
import numberSchema from './number'

export const itemNameSchema = z.object({
    name: z.string().min(1, 'Item name cannot be empty.'),
    id: z.string().uuid(),
})

export const itemTargetSchema = z.object({
    target: numberSchema,
    id: z.string().uuid(),
})

export const itemAssignedSchema = z.object({
    amount: numberSchema,
    id: z.string().uuid(),
})
