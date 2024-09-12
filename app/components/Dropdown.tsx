import React, { useEffect, useState } from 'react'
import { useTheme, useThemeClass } from '~/context/ThemeContext'
import Icon from './icons/Icon'

export type DropdownItem = {
    name: string
    id: string
}

export function mapToDropdownItem(
    sourceArr: { id: string; name: string }[] | undefined
): DropdownItem[] {
    return (
        sourceArr?.map((x) => {
            return { id: x.id, name: x.name }
        }) ?? []
    )
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
            className={`w-full p-2 text-left hover:cursor-pointer hover:bg-opacity-80 transition ${className}`}
        >
            <span className="w-full truncate">{name}</span>
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
    disabled?: boolean
}

const Dropdown = ({
    dropdownItems,
    defaultItem,
    className,
    onChange,
    errorState = false,
    onExpand,
    disabled,
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

    const focusThemeStyles =
        theme === 'DARK' ? 'focus:outline-light ' : 'focus:outline-dark '
    const outlineThemeStyles =
        theme === 'DARK' ? 'outline-light ' : 'outline-dark '

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

    return disabled ? (
        <div
            aria-disabled
            className={`select-none ${className} ${themeStyle} transition min-w-64 rounded-lg p-2 mt-1 brightness-75 hover:cursor-not-allowed`}
        >
            {current?.name || 'Select'}
        </div>
    ) : (
        <div className="mt-1">
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
                    disabled={disabled}
                    className={`w-full p-2 text-left rounded-lg transition flex justify-between items-center outline outline-[3px] outline-offset-2 
                        ${focusThemeStyles} ${
                        active ? outlineThemeStyles : 'outline-none'
                    } transition-all duration-100`}
                    onClick={(e) => {
                        e.preventDefault()
                        if (onExpand) {
                            onExpand()
                        }
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
                    } ${themeClass} max-h-64 2xl:max-h-80 w-full z-50 flex flex-col rounded-b-lg overflow-x-hidden overflow-y-auto divide-y-[1px] divide-subtle shadow-lg`}
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
                    {dropdownItems.length === 0 && (
                        <div
                            className={`text-subtle text-sm ${themeStyle} p-2`}
                        >
                            No items available.
                        </div>
                    )}
                </div>
            </div>

            <p
                className={`${
                    !errorState && 'invisible'
                } text-sm mt-0.5 ml-1 text-error transition-all duration-100 animate-fade-in`}
            >
                {errorState && 'An item must be selected.'}&nbsp;
            </p>
        </div>
    )
}

export default Dropdown
