import React, { MouseEventHandler } from 'react'

type DeleteButtonProps = {
    onClick?: MouseEventHandler<HTMLButtonElement>
    children?: React.ReactNode
    className?: string
    noSubmit?: boolean
    disabled?: boolean
}

const DeleteButton = ({
    onClick,
    children = 'Delete',
    noSubmit = false,
    className,
    disabled = false,
}: DeleteButtonProps) => {
    return (
        <button
            className={`bg-error text-error disabled:cursor-not-allowed disabled:bg-opacity-10 bg-opacity-20 shadow-sm hover:bg-opacity-40 p-3 rounded-lg transition ease-in-out text-base ${className}`}
            type={noSubmit ? 'button' : 'submit'}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    )
}

export default DeleteButton
