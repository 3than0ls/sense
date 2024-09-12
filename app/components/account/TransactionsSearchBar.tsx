import React, { useRef } from 'react'
import Icon from '../icons/Icon'
import { useTheme, useThemeClass } from '~/context/ThemeContext'

type TransactionsSearchBarProps = {
    onChange?: React.ChangeEventHandler<HTMLInputElement>
    defaultValue?: string
}

const TransactionsSearchBar = ({
    onChange,
    defaultValue,
}: TransactionsSearchBarProps) => {
    const inputBut = useRef<HTMLInputElement | null>(null)

    const { theme } = useTheme()
    const themeStyle =
        theme === 'DARK' ? 'bg-dark border-light' : 'bg-light border-light'

    return (
        <div
            className={`flex gap-4 items-center px-4 select-none border-b border-b-subtle ${themeStyle}`}
        >
            <button
                onClick={() => {
                    inputBut.current?.focus()
                }}
            >
                <Icon type="magnifying-glass" className="size-4" />
            </button>
            <input
                autoComplete="off"
                ref={inputBut}
                name="search-no-fill"
                id="search-no-fill"
                className="text-base p-1 bg-transparent outline-none w-full"
                onChange={onChange}
                defaultValue={defaultValue}
                placeholder="Search here..."
            />
        </div>
    )
}

export default TransactionsSearchBar
