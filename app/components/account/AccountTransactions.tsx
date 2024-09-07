import React from 'react'
import { useTheme, useThemeClass } from '~/context/ThemeContext'
import { FullAccountDataType } from '~/prisma/fullAccountData'
import Transaction, { TransactionRow } from './Transaction'

type AccountTransactionProps = {
    accountData: FullAccountDataType
}

const AccountTransactions = ({ accountData }: AccountTransactionProps) => {
    const { theme } = useTheme()
    const themeStyle =
        theme === 'DARK'
            ? 'bg-black border-dark divide-dark'
            : 'bg-white border-light divide-light'

    return (
        <div className="w-full h-full">
            <table className={`w-full table-fixed text-left border-collapse`}>
                <colgroup>
                    <col className="w-28 px-24" />
                    <col className="w-1/3" />
                    <col className="w-2/3" />
                    <col className="w-36" />
                </colgroup>
                <thead>
                    <tr className={`${themeStyle} h-8 divide-x-2 border-b-2`}>
                        <th className="px-3 truncate">Date</th>
                        <th className="px-3 truncate">Category and Item</th>
                        <th className="px-3 truncate">Description</th>
                        <th className="px-3 truncate pr-3 text-right">
                            Amount
                        </th>
                    </tr>
                </thead>
                <tbody className="border-t border-subtle">
                    {Array.from(accountData.transactions, (t) => (
                        <Transaction transaction={t} key={t.id} />
                    ))}
                    <TransactionRow
                        date={new Date(
                            accountData.createdAt
                        ).toLocaleDateString()}
                        amt={`$${accountData.initialBalance.toFixed(2)}`}
                        cat=""
                        desc="Initial balance on creation of account."
                    />
                </tbody>
            </table>
        </div>
    )
}

export default AccountTransactions
