import { useTheme } from '~/context/ThemeContext'
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

    // table can be made adjustable with shadcn: https://ui.shadcn.com/docs/components/resizable
    // but that's for the future

    // table widths are something I abhor

    return (
        <div className={`w-full h-full flex-grow ${themeStyle}`}>
            <table className={`w-full table-fixed text-left border-collapse`}>
                <colgroup>
                    <col className="w-10" />
                    <col className="w-28" />
                    <col className="w-1/3" />
                    <col className="w-2/3" />
                    <col className="w-36" />
                </colgroup>
                <thead>
                    <tr className={`${themeStyle} h-8 divide-x-2 border-b-2`}>
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
                            budgetId={accountData.budgetId}
                            transaction={t}
                            key={t.id}
                        />
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
