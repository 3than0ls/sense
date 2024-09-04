import React, { MouseEventHandler } from 'react'

type DeleteButtonProps = {
    onClick: MouseEventHandler<HTMLButtonElement>
    children?: React.ReactNode
    className?: string
}

const DeleteButton = ({
    onClick,
    children = 'Delete',
    className,
}: DeleteButtonProps) => {
    return (
        <button
            className={`bg-error text-error bg-opacity-20 shadow-sm hover:bg-opacity-40 p-3 rounded-lg transition ease-in-out text-base ${className}`}
            type="submit"
            onClick={onClick}
        >
            {children}
        </button>
    )
}

export default DeleteButton
