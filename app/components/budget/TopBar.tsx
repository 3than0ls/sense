import React from 'react'
import Icon from '../icons/Icon'
import ThreeValues from './ThreeValues'
import { useFetcher } from '@remix-run/react'

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

    return (
        <div className="sticky top-0 w-full bg-black h-10 flex items-center px-4 gap-3 justify-between border-b border-subtle z-50">
            <button
                onClick={createCategory}
                className="flex items-center gap-2 hover:opacity-85 transition"
            >
                Create Category
                <Icon
                    type="plus-circle"
                    className="size-5 stroke-subtle"
                    interactive
                />
            </button>
            <ThreeValues
                assigned="Assigned"
                balance="Balance"
                target="Target"
            />
        </div>
    )
}

export default TopBar
