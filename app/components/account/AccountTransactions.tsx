import { useTheme } from '~/context/ThemeContext'
import Transaction, { TransactionRow } from './Transaction'
import toCurrencyString from '~/utils/toCurrencyString'
import TransactionsSearchBar from './TransactionsSearchBar'
import { useState } from 'react'
import { BasicBudgetType, FullAccountType } from '~/prisma/fullAccountData'

type AccountTransactionProps = {
    accountData: FullAccountType
    basicBudgetData: BasicBudgetType
}

const AccountTransactions = ({
    accountData,
    basicBudgetData,
}: AccountTransactionProps) => {
    const { theme } = useTheme()
    const themeStyle =
        theme === 'DARK'
            ? 'bg-black border-dark divide-dark'
            : 'bg-white border-light divide-light'

    // table can be made adjustable with shadcn: https://ui.shadcn.com/docs/components/resizable
    // but that's for the future

    // for filtering; perhaps look into https://tailwindcss.com/docs/visibility#collapsing-elements

    // table widths are something I abhor

    const [search, setSearch] = useState('')

    return (
        <div className={`w-full h-full flex-grow ${themeStyle}`}>
            <TransactionsSearchBar
                onChange={(e) => setSearch(e.target.value)}
            />
            <table className={`w-full table-fixed text-left border-collapse`}>
                <colgroup>
                    <col className="w-10" />
                    <col className="w-28" />
                    <col className="w-1/3" />
                    <col className="w-2/3" />
                    <col className="w-36" />
                </colgroup>
                <thead>
                    <tr className={`${themeStyle} h-8 divide-x-2 border-y-2`}>
                        <th className="px-3 truncate"></th>
                        <th className="px-3 truncate">Date</th>
                        <th className="px-3 truncate">Category and Item</th>
                        <th className="px-3 truncate">Description</th>
                        <th className="pl-3 pr-5 truncate text-right">
                            Amount
                        </th>
                    </tr>
                </thead>
                <tbody className="border-t border-subtle">
                    {Array.from(accountData.transactions, (t) => (
                        <Transaction
                            basicBudgetData={basicBudgetData}
                            accountData={accountData}
                            transaction={t}
                            key={t.id}
                            search={search}
                        />
                    ))}
                    <TransactionRow
                        date={new Date(
                            accountData.createdAt
                        ).toLocaleDateString()}
                        amt={toCurrencyString(accountData.initialBalance, true)}
                        cat=""
                        desc="Initial balance on creation of account."
                        search={search}
                    />
                </tbody>
            </table>
        </div>
    )
}

export default AccountTransactions
