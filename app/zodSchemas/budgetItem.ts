import { z } from 'zod'

const itemNameSchema = z.object({
    name: z.string().min(1, 'Item name cannot be empty.'),
})

export default itemNameSchema
