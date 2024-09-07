import React from 'react'
import { useTheme } from '~/context/ThemeContext'
import { FullAccountDataType } from '~/prisma/fullAccountData'

type TransactionProps = {
    transaction: FullAccountDataType['transactions'][number]
    className?: string
}

const Transaction = ({ transaction, className }: TransactionProps) => {
    return (
        <TransactionRow
            date={new Date(transaction.date).toLocaleDateString()}
            cat={`${transaction.budgetItem.budgetCategory.name}: ${transaction.budgetItem.name}`}
            desc={transaction.description || ''}
            amt={`$${transaction.amount.toFixed(2)}`}
        />
    )
}

export const TransactionRow = ({
    date,
    cat,
    desc,
    amt,
}: {
    date: string
    cat: string
    desc: string
    amt: string
}) => {
    const { theme } = useTheme()
    const themeStyle = theme === 'DARK' ? 'bg-black' : 'bg-white'

    return (
        <tr className={`${themeStyle} border-b-2 border-dark h-8`}>
            <td className="px-3 truncate">{date}</td>
            <td className="px-3 truncate">{cat}</td>
            <td className="px-3 truncate">{desc}</td>
            <td className="px-3 truncate text-right">{amt}</td>
        </tr>
    )
}

export default Transaction
