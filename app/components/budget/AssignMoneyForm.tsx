import { BudgetItem } from '@prisma/client'
import Dropdown from '../Dropdown'
import { useEffect, useState } from 'react'
import { useFetcher } from '@remix-run/react'
import { useTheme } from '~/context/ThemeContext'
import numberSchema from '~/zodSchemas/number'
import { action } from '~/routes/api.budItem.assign'
import { useModal } from '~/context/ModalContext'
import { loader } from '~/routes/api.bud.items.$budgetId'

type AssignMoneyFormProps = {
    targetBudgetItem: BudgetItem
    targetBudgetItemAssigned: number
}

const AssignMoneyForm = ({
    targetBudgetItem,
    targetBudgetItemAssigned,
}: AssignMoneyFormProps) => {
    // IGNORE THE MESSINESS BUT IT WORKS!!
    const [dropdownItems, setDropdownItems] = useState([
        {
            name: 'Free Cash',
            id: 'Free Cash',
        },
    ])

    const budgetItemFetcher = useFetcher<typeof loader>()
    useEffect(() => {
        if (!budgetItemFetcher.data) {
            budgetItemFetcher.load(
                `/api/bud/items/${targetBudgetItem.budgetId}`
            )
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (budgetItemFetcher.data && budgetItemFetcher.data.length > 0) {
            setDropdownItems([
                {
                    name: 'Free Cash',
                    id: 'Free Cash',
                },
                ...budgetItemFetcher.data
                    .filter((bItem) => bItem.id !== targetBudgetItem.id)
                    .map((bItem) => {
                        return {
                            name: bItem.name,
                            id: bItem.id,
                        }
                    }),
            ])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [budgetItemFetcher.data])

    // dropdown and input states
    const [from, setFrom] = useState(dropdownItems[0])
    const [rawAmount, setRawAmount] = useState('')
    const [amount, setAmount] = useState(0)
    const [error, setError] = useState('')

    // modal state manager
    const { setActive } = useModal()

    // theme colors
    const { theme } = useTheme()
    const themeStyle =
        theme === 'DARK' ? 'bg-light text-light' : 'bg-white text-light'
    const focusThemeStyles =
        theme === 'DARK' ? 'focus:outline-light' : 'focus:outline-dark'

    const fetcher = useFetcher<typeof action>()
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault()
        const fromFreeCash = from.name === 'Free Cash'
        fetcher.submit(
            {
                targetBudgetItemId: targetBudgetItem.id,
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
                setActive(false)
            } else {
                setError(fetcher.data.reason)
            }
        }
    }, [fetcher.data, setActive])

    return (
        <fetcher.Form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 w-full"
        >
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
                        placeholder="Enter amount"
                        value={rawAmount}
                        type="text"
                        className={`${themeStyle}  transition-all duration-100 outline-none outline-offset-2 outline-[3px] ${focusThemeStyles} outline-offset-2 w-full p-2 text-left rounded-lg hover:bg-opacity-85 flex justify-between items-center`}
                    />
                    <button
                        onClick={() => {
                            // TEMP TODO FIX THIS
                            const leftover =
                                targetBudgetItem.target -
                                targetBudgetItemAssigned
                            setRawAmount(leftover.toFixed(2))
                            setAmount(leftover)
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

export default AssignMoneyForm
