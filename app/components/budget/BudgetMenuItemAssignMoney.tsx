import { BudgetItem } from '@prisma/client'
import Dropdown from '../Dropdown'
import { useEffect, useState } from 'react'
import { useFetcher } from '@remix-run/react'
import { useTheme } from '~/context/ThemeContext'
import numberSchema from '~/zodSchemas/number'
import { action } from '~/routes/api.budItem.assign'

type BudgetMenuItemAssignMoneyProps = {
    target: BudgetItem
    budgetItems: BudgetItem[]
    className?: string
}

const BudgetMenuItemAssignMoney = ({
    target,
    budgetItems,
}: BudgetMenuItemAssignMoneyProps) => {
    // fetch user data
    const dropdownItems = [
        {
            name: 'Free Cash',
            id: 'Free Cash',
        },
        ...budgetItems
            .filter((bItem) => bItem.id !== target.id)
            .map((bItem) => {
                return {
                    name: bItem.name,
                    id: bItem.id,
                }
            }),
    ]

    const [from, setFrom] = useState(dropdownItems[0])
    const [rawAmount, setRawAmount] = useState('0.00')
    const [amount, setAmount] = useState(0)
    const [error, setError] = useState('')

    const fetcher = useFetcher<typeof action>()

    const { theme } = useTheme()
    const themeStyle =
        theme === 'DARK' ? 'bg-light text-light' : 'bg-dark text-dark'

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault()
        const fromFreeCash = from.name === 'Free Cash'
        fetcher.submit(
            {
                targetBudgetItemId: target.id,
                fromFreeCash,
                fromBudgetItemId: fromFreeCash ? '' : from.id,
                amount,
            },
            {
                method: 'POST',
                action: '/api/budItem/assign',
            }
        )
    }

    useEffect(() => {
        if (fetcher.data) {
            if (fetcher.data.success) {
                // trigger a modal close or some shit. refresh page!
            } else {
                setError(fetcher.data.reason)
            }
            console.log('fetcher data changed', fetcher.data)
        }
    }, [fetcher.data])

    return (
        <fetcher.Form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 w-96"
        >
            <span className="text-2xl">Assign Money to {target.name}</span>
            <div>
                <span>From:</span>
                <Dropdown
                    dropdownItems={dropdownItems}
                    defaultItem={dropdownItems[0]}
                    onChange={(d) => {
                        setFrom(d)
                    }}
                    className="w-full"
                />
            </div>
            <div className="flex flex-col">
                <span>Amount:</span>
                <div className="flex gap-2">
                    <input
                        onChange={(e) => {
                            setRawAmount(e.target.value)
                            const out = numberSchema.safeParse(e.target.value)
                            if (out.success) {
                                setAmount(out.data)
                                setError('')
                            } else {
                                setError(out.error.errors[0].message)
                            }
                        }}
                        value={rawAmount}
                        type="text"
                        className={`${themeStyle} w-full p-2 text-left rounded-lg hover:bg-opacity-85 transition flex justify-between items-center`}
                    />
                    <button
                        onClick={() => {
                            // TEMP TODO FIX THIS
                            const amt = 0.01
                            setRawAmount(amt.toFixed(2))
                            setAmount(amt)
                            setError('')
                        }}
                        type="button"
                        className="bg-primary rounded-lg py-2 px-3 text-sm text-nowrap hover:bg-opacity-85 transition"
                    >
                        Reach Target
                    </button>
                </div>
                {error && <span className="text-error">{error}</span>}
            </div>
            <button
                type="submit"
                disabled={!!error}
                className={`hover:cursor-pointer enabled:hover:bg-opacity-85 disabled:hover:cursor-not-allowed disabled:opacity-50  transition bg-primary rounded-lg w-fit mr-auto px-4 py-2`}
            >
                Assign Money
            </button>
        </fetcher.Form>
    )
}

export default BudgetMenuItemAssignMoney
