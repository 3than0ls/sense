import { useFetcher } from '@remix-run/react'
import { useEffect, useRef, useState } from 'react'
import { useThemeClass } from '~/context/ThemeContext'
import { FullBudgetItemDataType } from '~/prisma/fullBudgetItemData'

const BudgetItemExpandedTable = ({
    budgetItemId,
    budgetItemName,
}: {
    budgetItemId: string
    budgetItemName: string
}) => {
    const fetcher = useFetcher()

    const [budgetItem, setBudgetItem] = useState<FullBudgetItemDataType | null>(
        null
    )

    const fetchStarted = useRef(false)

    useEffect(() => {
        if (!fetchStarted.current) {
            fetchStarted.current = true
            fetcher.load(`/api/budItem/${budgetItemId}`)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (fetcher.data && budgetItem === null) {
            setBudgetItem(fetcher.data as FullBudgetItemDataType)
        }
    }, [fetcher.data, budgetItem])

    const themeClass = useThemeClass()

    return (
        <div
            className={`w-full ${themeClass} flex flex-col p-4 rounded-lg shadow-sm`}
        >
            <span className="text-lg">
                Recent transactions for {budgetItemName}
            </span>
            {budgetItem === null ? (
                <div className="w-full">loading</div>
            ) : (
                <table>smt</table>
            )}
        </div>
    )
    // return <table></table>
}

export default BudgetItemExpandedTable
