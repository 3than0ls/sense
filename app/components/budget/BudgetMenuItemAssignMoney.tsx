import { BudgetItem } from '@prisma/client'
import Dropdown from '../Dropdown'
import { useState } from 'react'
import { useFetcher } from '@remix-run/react'
import { z } from 'zod'
import { useTheme } from '~/context/ThemeContext'

type BudgetMenuItemAssignMoneyProps = {
    target: BudgetItem
    budgetItems: BudgetItem[]
    className?: string
}

const valueSchema = z
    .string()
    .min(1, 'Value cannot be empty')
    // https://regex101.com/r/mZ1tX2/1
    // https://stackoverflow.com/questions/2811031/decimal-or-numeric-values-in-regular-expression-validation "Fractional Numbers, Positive"
    .regex(
        new RegExp(/^(0|[1-9]\d*)?(\.\d+)?(?<=\d)$/),
        'Value must be a non-negative number.'
    )
    .refine(
        (value) => {
            // I despise working with regex
            const split = value.split('.')
            return split.length === 1 || split[1].length <= 2
        },
        { message: 'Value can have at most 2 decimal points.' }
    )

    .transform((value) => {
        const pFloat = +parseFloat(value).toFixed(2)
        return pFloat
    })

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

    const fetcher = useFetcher()

    const { theme } = useTheme()
    const themeStyle =
        theme === 'DARK' ? 'bg-light text-light' : 'bg-dark text-dark'

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault()
        const fromFreeCash = from.name === 'Free Cash'
        fetcher.formAction = '/assign'
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
                            const out = valueSchema.safeParse(e.target.value)
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
                            const amt = target.target - target.assigned
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
