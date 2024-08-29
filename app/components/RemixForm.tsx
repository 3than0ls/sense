import { FetcherWithComponents } from '@remix-run/react'
import React from 'react'
import {
    FieldValues,
    FormProvider,
    SubmitHandler,
    UseFormReturn,
} from 'react-hook-form'

type RemixFormProps<FormValues extends FieldValues> = {
    methods: UseFormReturn<FormValues, unknown, undefined>
    fetcher: FetcherWithComponents<unknown>
    onSubmit?: SubmitHandler<FormValues>
    className?: string
    noAction?: boolean
    children?: React.ReactNode
}

/**
 * `methods` and `fetcher` params can be left out if you don't have a need for them outside this RemixForm, otherwise use `useRemixForm` to get them.
 *
 *
 * `noAction` specifies that no action will be taken on submitting, and nothing will be submitted. For client side forms only that want the benefit of error handling.
 *
 *
 */
export default function RemixForm<FormValues extends FieldValues>({
    methods,
    fetcher,
    onSubmit = () => {},
    className,
    noAction = false,
    children,
}: RemixFormProps<FormValues>) {
    const _handleSubmit = async (
        e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>
    ) => {
        console.log('something happened')
        // if we don't provide e to method.handleSubmit(onSubmit)(e), it will not prevent default, submitting regardless
        await methods.handleSubmit(onSubmit)(e)

        if (Object.keys(methods.formState.errors).length === 0 && !noAction) {
            fetcher.submit(methods.getValues(), { method: 'POST' })
        }
    }

    return (
        <FormProvider {...methods}>
            <fetcher.Form
                method="POST"
                onSubmit={_handleSubmit}
                className={className}
            >
                {children}
            </fetcher.Form>
        </FormProvider>
    )
}
