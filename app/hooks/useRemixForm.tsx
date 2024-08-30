import { zodResolver } from '@hookform/resolvers/zod'
import { useActionData, useFetcher } from '@remix-run/react'
import { FieldValues, useForm } from 'react-hook-form'
import { z } from 'zod'

/**
 * useRemixForm is a hook that uses react-hook-form's `FormProvider` and Remix's `fetcher.Form`, used in conjunction with RemixForm.tsx,
 *
 * This allows you to reap the benefits of (not in order):
 *
 *  (1) React Hook Form's `FormProvider`: allowing `useFormContext` hook to be used for input wherever.
 *
 *  (2) React Hook Form's (in conjunction with Zod/other validators): client side validation, and if there is an error, don't `POST` to action.
 *
 *  (3) Remix's `useFetcher()`'s `Form`: `POST` to action, assuming client side validation passed with no errors.
 *
 *
 * remix-hook-form was broken, inadequate, and far differed from react-hook-form.
 * react-hook-form alone did not suffice, since it prevented default, thus preventing POST to action.
 * Using Remix's clientAction for client side schema validation/parsing with zod seemed unecessary since I was already doing it with react-hook-form useForm's resolver.
 *
 * @example
 * // outside of component
 * import useRemixForm from ...
 * import RemixForm from ...
 *
 * const schema = z.object({ ... })
 * type FormValues = z.infer<typeof schema>
 *
 * ...
 * // in component
 * const { methods, fetcher } = useRemixForm<FormValues>(schema)
 * const onSubmit = (data: FormValues) => {
 *      // some action
 *      // will prevent fetcher from POSTING to the action, something you COULD do but better off doing in schema
 *      methods.setError('field', { type: 'custom', message: 'Invalid field' })
 * }
 * ...
 * // JSX for component
 * <RemixForm methods={methods} fetcher={fetcher} onSubmit={onSubmit}>
 *  {various input elements within context}
 * </RemixForm>
 *
 *
 */
export default function useRemixForm<FormValues extends FieldValues>(
    zodSchema: z.AnyZodObject,
    reValidateMode?: 'onBlur' | 'onChange' | 'onSubmit'
) {
    const methods = useForm<FormValues>({
        resolver: zodResolver(zodSchema),
        reValidateMode,
    })

    const fetcher = useFetcher<FormValues>()

    return {
        methods,
        fetcher,
    }
}

export type ActionReturnType<Action> = ReturnType<typeof useActionData<Action>>
