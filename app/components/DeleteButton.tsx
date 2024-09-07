import React, { MouseEventHandler } from 'react'

type DeleteButtonProps = {
    onClick: MouseEventHandler<HTMLButtonElement>
    children?: React.ReactNode
    className?: string
    noSubmit?: boolean
}

const DeleteButton = ({
    onClick,
    children = 'Delete',
    noSubmit = false,
    className,
}: DeleteButtonProps) => {
    return (
        <button
            className={`bg-error text-error bg-opacity-20 shadow-sm hover:bg-opacity-40 p-3 rounded-lg transition ease-in-out text-base ${className}`}
            type={noSubmit ? 'button' : 'submit'}
            onClick={onClick}
        >
            {children}
        </button>
    )
}

export default DeleteButton
