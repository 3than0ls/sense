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
            className={`bg-error text-error bg-opacity-30 shadow-sm hover:bg-opacity-40 p-3 rounded-lg hover:shadow-md transition ease-in-out ${className}`}
            type="submit"
            onClick={onClick}
        >
            {children}
        </button>
    )
}

export default DeleteButton
