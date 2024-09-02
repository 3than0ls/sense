import React from 'react'
import Icon from '../icons/Icon'
import ThreeValues from './ThreeValues'
import { useFetcher } from '@remix-run/react'
import { useTheme } from '~/context/ThemeContext'

type TopBarProps = {
    budgetId: string
}

const TopBar = ({ budgetId }: TopBarProps) => {
    const fetcher = useFetcher()

    const createCategory = () => {
        fetcher.submit(
            {
                budgetId,
            },
            {
                action: '/api/budCat/create',
                method: 'post',
            }
        )
    }

    const { theme } = useTheme()
    const themeStyle = theme === 'DARK' ? 'bg-black' : 'bg-white'
    const hoverThemeStyle =
        theme === 'DARK' ? 'hover:stroke-light' : 'hover:stroke-dark'

    return (
        <div
            className={`sticky top-0 w-full bg-black h-10 flex items-center px-4 gap-3 justify-between border-b border-subtle z-40 ${themeStyle}`}
        >
            <button
                onClick={createCategory}
                className="flex items-center gap-2 hover:opacity-85 transition"
            >
                Create Category
                <Icon
                    type="plus-circle"
                    className={`size-5 stroke-subtle ${hoverThemeStyle} transition`}
                    interactive
                />
            </button>

            <div className="flex items-center gap-4 min-h-10">
                <div className="w-24 flex justify-end items-center gap-2">
                    <span className="text-right">Balance</span>
                    <hr className="bg-balance border-0 aspect-square h-2 rounded-full" />
                </div>

                <div className="w-24 flex justify-end items-center gap-2">
                    <span className="text-right">Assigned</span>
                    <hr className="bg-assigned border-0 aspect-square h-2 rounded-full" />
                </div>
                <div className="w-24 flex justify-end items-center gap-2">
                    <span className="text-right">Target</span>
                    <hr className="bg-target border-0 aspect-square h-2 rounded-full" />
                </div>
            </div>
        </div>
    )
}

export default TopBar
