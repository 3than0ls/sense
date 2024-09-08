import React from 'react'
import Icon from './icons/Icon'

type ExclamationProps = {
    children?: React.ReactNode
    iconClassName?: string
    divClassName?: string
}

const Exclamation = ({
    iconClassName,
    divClassName,
    children,
}: ExclamationProps) => {
    return (
        <div className={`${divClassName} text-lg`}>
            <Icon
                type="exclamation-circle"
                className={`size-6 mr-1 inline-block align-middle transform -translate-y-[1px] ${iconClassName}`}
            />
            {children}
        </div>
    )
}

export default Exclamation
