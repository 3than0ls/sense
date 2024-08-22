import React, { useEffect, useState } from 'react'
import { useTheme, useThemeClass } from '~/context/ThemeContext'
import Icon from './icons/Icon'

type DropdownItem = {
    name: string
    id: string
}

const DropdownItem = ({
    dropdownItem: { name },
    onClick,
    className,
}: {
    dropdownItem: DropdownItem
    onClick: React.MouseEventHandler<HTMLButtonElement>
    className: string
}) => {
    return (
        <button
            onClick={onClick}
            className={`w-full p-2 text-left hover:cursor-pointer hover:bg-opacity-85 transition ${className}`}
        >
            {name}
        </button>
    )
}

type DropdownProps = {
    dropdownItems: DropdownItem[]
    defaultItem?: DropdownItem
    className?: string
    onChange?: (dropdownItem: DropdownItem) => void
}

const Dropdown = ({
    dropdownItems,
    defaultItem,
    className,
    onChange,
}: DropdownProps) => {
    const { theme } = useTheme()
    const themeStyle =
        theme === 'DARK' ? 'bg-light text-light' : 'bg-dark text-dark'
    const themeClass = useThemeClass()

    const [active, setActive] = useState(false)

    const [current, setCurrent] = useState(defaultItem ?? null)

    const onItemClick = (dropdownItem: DropdownItem) => {
        setActive(false)
        setCurrent(dropdownItem)
    }

    useEffect(() => {
        if (onChange && current) {
            onChange(current)
        }
    }, [onChange, current])

    return (
        <div
            className={`${className} ${themeStyle} min-w-64 relative ${
                active ? 'rounded-t-lg' : 'rounded-lg'
            } divide-y-2 divide-subtle`}
        >
            <button
                className="w-full p-2 text-left rounded-2xl hover:bg-opacity-85 transition flex justify-between items-center"
                onClick={() => setActive(!active)}
            >
                <span className="">{current?.name || 'Select'}</span>
                <Icon
                    type="chevron-down"
                    className={`size-5 transform ${
                        active && '-rotate-180'
                    } transition`}
                />
            </button>
            <div
                className={`${
                    active ? 'absolute' : 'hidden'
                } ${themeClass} w-full flex flex-col rounded-b-lg overflow-hidden divide-y-[1px] divide-subtle`}
            >
                {Array.from(dropdownItems, (dItem) => (
                    <DropdownItem
                        onClick={() => onItemClick(dItem)}
                        className={themeStyle}
                        dropdownItem={dItem}
                        key={dItem.id}
                    />
                ))}
            </div>
        </div>
    )
}

export default Dropdown
