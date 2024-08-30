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
        <div className="sticky top-0 w-full bg-black h-10 flex items-center px-4 gap-3 justify-between border-b border-subtle z-40">
            <button
                onClick={createCategory}
                className="flex items-center gap-2 hover:opacity-85 transition"
            >
                Create Category
                <Icon
                    type="plus-circle"
                    className="size-5 stroke-subtle hover:brightness-150 transition"
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
