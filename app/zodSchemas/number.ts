import { z } from 'zod'

const numberSchema = z
    .string()
    .min(1, 'Value cannot be empty')
    // https://regex101.com/r/mZ1tX2/1
    // https://stackoverflow.com/questions/2811031/decimal-or-numeric-values-in-regular-expression-validation "Fractional Numbers, Positive"
    .regex(
        new RegExp(/^(0|[1-9]\d*)?(\.\d+)?(?<=\d)$/),
        'Value must be a non-negative number.'
    )
    .refine(
        (value) => {
            // I despise working with regex
            const split = value.split('.')
            return split.length === 1 || split[1].length <= 2
        },
        { message: 'Value can have at most 2 decimal points.' }
    )

    .transform((value) => {
        const pFloat = +parseFloat(value).toFixed(2)
        return pFloat
    })

export default numberSchema
