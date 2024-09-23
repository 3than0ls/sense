import React, { useEffect } from 'react'
import RemixForm from './RemixForm'
import { FetcherWithComponents } from '@remix-run/react'
import { FieldValues, SubmitHandler, UseFormReturn } from 'react-hook-form'
import { useModal } from '~/context/ModalContext'
import DeleteButton from './DeleteButton'
import Divider from './Divider'
import Submit from './form/Submit'
import Icon from './icons/Icon'
import useCloseModalWhenDone from '~/hooks/useCloseModalWhenDone'

type CreateUpdateModalFormProps<FormValues extends FieldValues> = {
    children: React.ReactNode
    methods: UseFormReturn<FormValues, unknown, undefined>
    fetcher: FetcherWithComponents<unknown>
    name: string
    deleteForm?: React.ReactNode
    type: 'create' | 'update'
    onSubmit: SubmitHandler<FormValues>
    disable?: boolean
    className?: string
    submitButtonText?: string
}

export default function CreateUpdateModalForm<FormValues extends FieldValues>({
    children,
    methods,
    fetcher,
    name,
    deleteForm,
    type,
    onSubmit,
    disable,
    className,
    submitButtonText,
}: CreateUpdateModalFormProps<FormValues>) {
    const { setModalTitle, setModalChildren, setActive } = useModal()

    useCloseModalWhenDone(fetcher)

    const onDeleteClick = () => {
        if (type === 'update') {
            setModalTitle('Confirm Deletion')
            setModalChildren(deleteForm)
            setActive(true)
        }
    }

    return (
        <RemixForm
            className={`min-w-96 flex flex-col gap-1 ${className}`}
            methods={methods}
            fetcher={fetcher}
            onSubmit={onSubmit}
            noAction
        >
            {children}
            <Submit
                disabled={disable || fetcher.state !== 'idle'}
                className="w-full py-2 rounded-xl"
            >
                {submitButtonText
                    ? submitButtonText
                    : type === 'update'
                    ? `Update ${name}`
                    : `Create ${name}`}
                {fetcher.state !== 'idle' && (
                    <Icon
                        type="spinner"
                        color="#fff"
                        className="size-6 animate-spin flex items-center justify-center"
                    />
                )}
            </Submit>
            {type === 'update' && (
                <div className="w-full mt-6 flex flex-col gap-4">
                    <Divider themed />
                    <DeleteButton
                        className="flex gap-4 justify-center"
                        onClick={onDeleteClick}
                    >
                        Delete {name}
                        <Icon type="trash" />
                    </DeleteButton>
                </div>
            )}
        </RemixForm>
    )
}
