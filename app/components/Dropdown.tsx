import React, { LegacyRef, useEffect, useRef, useState } from 'react'
import { useTheme, useThemeClass } from '~/context/ThemeContext'
import Icon from './icons/Icon'

export type DropdownItem = {
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
            className={`w-full truncate p-2 text-left hover:cursor-pointer hover:bg-opacity-80 transition ${className}`}
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
    onExpand?: () => void
    errorState?: boolean
}

const Dropdown = ({
    dropdownItems,
    defaultItem,
    className,
    onChange,
    errorState = false,
    onExpand,
}: DropdownProps) => {
    const { theme } = useTheme()
    const themeStyle =
        theme === 'DARK' ? 'bg-light text-light' : 'bg-white text-light'
    const hoverStyle =
        theme === 'DARK'
            ? 'hover:bg-opacity-80'
            : 'hover:bg-dark hover:bg-opacity-10'
    const themeClass = useThemeClass()

    const [active, setActive] = useState(false)

    const [current, setCurrent] = useState(defaultItem ?? null)

    const onItemClick = (dropdownItem: DropdownItem) => {
        // document.removeEventListener('mousedown', handleClickOutside)
        setActive(false)
        setCurrent(dropdownItem)
    }

    // invoke the given onChange event when the current value changes
    useEffect(() => {
        if (onChange && current) {
            onChange(current)
        }
    }, [onChange, current])

    const ref = React.useRef<HTMLDivElement>(null)
    function handleClickOutside(event: MouseEvent) {
        if (
            ref.current &&
            !ref.current.contains(event.target as unknown as Node) // teehee typescript!
        ) {
            setActive(false)
        }
    }

    return (
        <div>
            <div
                ref={ref}
                className={`${className} ${themeStyle} ${
                    !active && hoverStyle
                } transition min-w-64 relative ${
                    active ? 'rounded-t-lg' : 'rounded-lg'
                } divide-y-2 divide-subtle ${
                    errorState &&
                    ' outline outline-offset-2 outline-error outline-[3px]'
                }`}
            >
                <button
                    className={`w-full p-2 text-left rounded-2xl transition flex justify-between items-center outline-none
                `}
                    onClick={(e) => {
                        e.preventDefault()
                        if (onExpand) onExpand()
                        if (active) {
                            setActive(false)
                        } else {
                            document.addEventListener(
                                'mousedown',
                                handleClickOutside,
                                { once: true }
                            )
                            setActive(true)
                        }
                        setActive(!active)
                    }}
                >
                    <span className="truncate">
                        {current?.name || 'Select'}
                    </span>
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
                    } ${themeClass} w-full flex flex-col rounded-b-lg overflow-x-hidden max-h-64 divide-y-[1px] divide-subtle shadow-lg`}
                >
                    {Array.from(dropdownItems, (dItem) => (
                        <DropdownItem
                            onClick={(e) => {
                                e.preventDefault()
                                onItemClick(dItem)
                            }}
                            className={`${themeStyle} ${hoverStyle}`}
                            dropdownItem={dItem}
                            key={dItem.id}
                        />
                    ))}
                </div>
            </div>
            {errorState && (
                <span className="ml-1 text-error text-sm">
                    An item must be selected.
                </span>
            )}
        </div>
    )
}

export default Dropdown
