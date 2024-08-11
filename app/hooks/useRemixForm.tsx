import { zodResolver } from '@hookform/resolvers/zod'
import { useFetcher } from '@remix-run/react'
import React from 'react'
import {
    FieldValues,
    FormProvider,
    useForm,
    SubmitHandler,
} from 'react-hook-form'
import { z } from 'zod'

/**
 * useRemixForm is a hook that uses react-hook-form's `FormProvider` and Remix's `fetcher.Form`,
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
 * const schema = z.object({ ... })
 * type FormValues = z.infer<typeof schema>
 *
 * ...
 * // in component
 * const { methods, RemixForm } = useRemixForm<FormValues>(schema)
 * const onSubmit = (data: FormValues) => {
 *      console.log(data)
 *      // will prevent fetcher from POSTING to the action, something you COULD do but better off doing in schema
 *      methods.setError('field', { type: 'custom', message: 'Invalid field' })
 * }
 * ...
 * // JSX for component
 * <RemixForm onSubmit={onSubmit}>
 *  {various input elements within context}
 * </RemixForm>
 *
 *
 */
export default function useRemixForm<FormDataType extends FieldValues>(
    zodSchema: z.AnyZodObject
) {
    const methods = useForm<FormDataType>({
        resolver: zodResolver(zodSchema),
    })

    const fetcher = useFetcher<FormDataType>()

    const _handleSubmit = (
        onSubmit: SubmitHandler<FormDataType> = () => {}
    ) => {
        return async (
            e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>
        ) => {
            // if we don't provide e to method.handleSubmit(onSubmit)(e), it will not prevent default, submitting regardless
            await methods.handleSubmit(onSubmit)(e)
            if (Object.keys(methods.formState.errors).length === 0) {
                fetcher.submit(methods.getValues(), { method: 'POST' })
            }
        }
    }

    const RemixForm = ({
        children,
        className,
        onSubmit,
    }: {
        children?: React.ReactNode
        className?: string
        onSubmit?: SubmitHandler<FormDataType>
    }) => {
        return (
            <FormProvider {...methods}>
                <fetcher.Form
                    method="POST"
                    onSubmit={_handleSubmit(onSubmit)}
                    className={className}
                >
                    {children}
                </fetcher.Form>
            </FormProvider>
        )
    }

    return {
        methods,
        fetcher,
        RemixForm,
    }
}
