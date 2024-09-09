import { useFetcher } from '@remix-run/react'
import { useModal } from '~/context/ModalContext'
import React, { useEffect } from 'react'
import Exclamation from './Exclamation'
import DeleteButton from './DeleteButton'
import Icon from './icons/Icon'

type DeleteFormProps = {
    fetcherAction: string
    fetcherTarget: { [key: string]: string }
    onSubmitLoad?: (data: unknown) => void
    onSubmit?: () => void
    deleteButtonText?: string
    deleteItemName: string
    children?: React.ReactNode
}
/**
 * `onSubmitLoad` runs when the fetcher has submitted and received data back from the route, and the data is passed as the argument `data`.
 *
 *
 * `onSubmit` runs immediately when the fetcher has submitted.
 */
const DeleteForm = ({
    deleteButtonText,
    deleteItemName,
    fetcherAction,
    fetcherTarget,
    onSubmit,
    onSubmitLoad,
    children,
}: DeleteFormProps) => {
    const fetcher = useFetcher()

    const { setActive } = useModal()

    const onDelete = () => {
        if (fetcher.state !== 'submitting') {
            fetcher.submit(fetcherTarget, {
                action: fetcherAction,
                method: 'POST',
            })
            if (onSubmit) {
                onSubmit()
            }
        }
    }

    useEffect(() => {
        if (fetcher.data && fetcher.state === 'loading') {
            if (onSubmitLoad) {
                onSubmitLoad(fetcher.data)
            }
            setActive(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetcher.state, fetcher.data])

    return (
        <div className="flex flex-col gap-3 w-96">
            <div className="flex flex-col w-full px-2 gap-2">
                <div className="text-lg">
                    Are you sure you want to delete{' '}
                    <span className="font-work-bold">{deleteItemName}</span>?
                </div>
                {children}
                <Exclamation divClassName="mt-2">
                    <span className="font-work-bold">
                        This action is irreversible!
                    </span>
                </Exclamation>
            </div>
            <DeleteButton
                disabled={fetcher.state !== 'idle'}
                className="mt-3 flex justify-center gap-4"
                onClick={onDelete}
            >
                {deleteButtonText ?? 'Confirm Deletion'}
                {fetcher.state === 'submitting' && (
                    <Icon
                        type="spinner"
                        color="#fff"
                        className="size-6 animate-spin flex items-center justify-center"
                    />
                )}
            </DeleteButton>
        </div>
    )
}

export default DeleteForm
