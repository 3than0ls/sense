import { useFetcher } from '@remix-run/react'
import { useEffect, useRef, useState } from 'react'
import { useTheme, useThemeClass } from '~/context/ThemeContext'
import Icon from '../icons/Icon'
import toCurrencyString from '~/utils/toCurrencyString'
import { CurrentMonthBudgetItemType } from '~/prisma/fullBudgetItemData'

const BIETRow = ({
    transaction,
    collapsed,
}: {
    transaction: CurrentMonthBudgetItemType['transactions'][number]
    collapsed: boolean
}) => {
    return (
        <tr className={`h-6 ${collapsed && 'collapse'}`}>
            <td className="truncate">
                {new Date(transaction.date).toLocaleDateString()}
            </td>
            <td className="truncate">{transaction.account.name}</td>
            <td className="truncate">
                {transaction.description || (
                    <span className="text-subtle">No description provided</span>
                )}
            </td>
            <td className="truncate text-right">
                {toCurrencyString(transaction.amount)}
            </td>
        </tr>
    )
}

const BudgetItemExpandedTable = ({
    budgetItemId,
    budgetItemName,
}: {
    budgetItemId: string
    budgetItemName: string
}) => {
    const fetcher = useFetcher()

    const [budgetItem, setBudgetItem] =
        useState<CurrentMonthBudgetItemType | null>(null)

    const fetchStarted = useRef(false)

    useEffect(() => {
        if (!fetchStarted.current) {
            fetchStarted.current = true
            fetcher.load(`/api/budItem/${budgetItemId}`)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (
            fetcher.data &&
            Object.keys(fetcher.data).length > 0 &&
            budgetItem === null
        ) {
            setBudgetItem(fetcher.data as CurrentMonthBudgetItemType)
        }
    }, [fetcher.data, budgetItem])

    const themeClass = useThemeClass()
    const { theme } = useTheme()

    const [expanded, setExpanded] = useState(false)
    const collapsePast = 3

    return (
        <div
            className={`w-full ${themeClass} flex flex-col rounded-lg shadow-sm px-4 pt-3 ${
                expanded ? 'pb-2' : 'pb-4'
            }`}
        >
            <span className="text-lg">
                Recent transactions for {budgetItemName}
            </span>
            {budgetItem === null || budgetItem === undefined ? (
                <div className="w-full flex justify-center items-center p-6">
                    <Icon type="spinner" />
                </div>
            ) : (
                <div className="w-full relative">
                    <table className="table-fixed w-full border-collapse">
                        <colgroup>
                            <col className="w-24" />
                            <col className="w-1/3" />
                            <col className="w-2/3" />
                            <col className="w-28" />
                        </colgroup>
                        <thead>
                            <tr className={`border-b`}>
                                <th className="truncate text-left">Date</th>
                                <th className="truncate text-left">Account</th>
                                <th className="truncate text-left">
                                    Description
                                </th>
                                <th className="truncate text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="h-1" />
                            {Array.from(budgetItem.transactions, (t, k) => (
                                <BIETRow
                                    key={t.id}
                                    transaction={t}
                                    collapsed={
                                        expanded ? false : k >= collapsePast
                                    }
                                />
                            ))}
                        </tbody>
                    </table>
                    {budgetItem.transactions.length === 0 && (
                        <span className="text-subtle">
                            No recent transactions to show.
                        </span>
                    )}
                    {budgetItem.transactions.length > collapsePast && (
                        <div
                            className={`pointer-events-none ${
                                !expanded
                                    ? `absolute -bottom-2 h-20 bg-gradient-to-b from-transparent ${
                                          theme === 'DARK'
                                              ? 'from-dark/0  to-dark'
                                              : 'from-light/0  to-light'
                                      }`
                                    : ''
                            } w-full flex justify-center items-end`}
                        >
                            <button
                                className={`pointer-events-auto flex ${
                                    expanded ? 'flex-col-reverse' : 'flex-col'
                                } items-center justify-center underline`}
                                onClick={() => setExpanded(!expanded)}
                            >
                                {expanded ? 'View less' : 'View more'}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default BudgetItemExpandedTable
