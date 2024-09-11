import React from 'react'
import Icon from './icons/Icon'

type InformationProps = {
    children?: React.ReactNode
    iconClassName?: string
    divClassName?: string
}

const Information = ({
    iconClassName,
    divClassName,
    children,
}: InformationProps) => {
    return (
        <div
            className={`${divClassName} flex items-center text-wrap gap-1 text-base`}
        >
            <Icon
                type="information-circle"
                className={`size-6 mr-1 inline-block align-middle  ${iconClassName}`}
            />
            {children}
        </div>
    )
}

export default Information
