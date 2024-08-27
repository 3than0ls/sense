import { z } from 'zod'

const categoryNameSchema = z.object({
    name: z.string().min(1, 'Category name cannot be empty.'),
    id: z.string(),
})

export default categoryNameSchema
