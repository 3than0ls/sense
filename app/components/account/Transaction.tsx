import { useTheme } from '~/context/ThemeContext'
import { FullAccountDataType } from '~/prisma/fullAccountData'
import Icon from '../icons/Icon'
import { useModal } from '~/context/ModalContext'
import TransactionForm from '../budget/TransactionForm'
import toCurrencyString from '~/utils/toCurrencyString'

type TransactionProps = {
    transaction: FullAccountDataType['transactions'][number]
    budgetId: string
    search: string
}

const Transaction = ({ transaction, budgetId, search }: TransactionProps) => {
    const { setActive, setModalChildren, setModalTitle } = useModal()

    const fromFreeCashText = 'Unassigned Free Cash'
    const cat =
        transaction.budgetItem === null
            ? fromFreeCashText
            : `${transaction.budgetItem.budgetCategory.name}: ${transaction.budgetItem.name}`

    const onEdit = () => {
        setModalChildren(
            <TransactionForm
                budgetId={budgetId}
                defaultBudgetItem={transaction?.budgetItem ?? undefined}
                editTransaction={transaction}
            />
        )
        setModalTitle('Edit Transaction')
        setActive(true)
    }

    return (
        <TransactionRow
            date={new Date(transaction.date).toLocaleDateString()}
            cat={cat}
            desc={transaction.description || ''}
            amt={toCurrencyString(transaction.amount, true)}
            onEdit={onEdit}
            search={search}
            bad={transaction.amount < 0}
        />
    )
}

export const TransactionRow = ({
    date,
    cat,
    desc,
    amt,
    onEdit,
    search,
    bad = false,
}: {
    date: string
    cat: string
    desc: string
    amt: string
    onEdit?: () => void
    search: string
    bad?: boolean
}) => {
    const { theme } = useTheme()
    const themeStyle =
        theme === 'DARK' ? 'bg-black border-dark' : 'bg-white border-light'
    const hoverThemeStyle =
        theme === 'DARK' ? 'hover:stroke-light' : 'hover:stroke-dark'

    const searchFilter =
        search &&
        !(
            cat.includes(search) ||
            desc.includes(search) ||
            date.includes(search) ||
            amt.includes(search)
        )

    return (
        <tr
            className={`${themeStyle} ${
                searchFilter ? 'collapse' : ''
            } border-b-2`}
        >
            <td className="h-8 flex items-center justify-center">
                {onEdit && (
                    <button
                        onClick={onEdit}
                        className="w-fit h-8 flex items-center justify-center"
                    >
                        <Icon
                            type="edit"
                            className={`stroke-subtle size-5 ${hoverThemeStyle} transition`}
                        />
                    </button>
                )}
            </td>
            <td className={`px-3 h-8 truncate border-l ${themeStyle}`}>
                {date}
            </td>
            <td className="px-3 h-8 truncate">{cat}</td>
            <td className="px-3 h-8 truncate">{desc}</td>
            <td
                className={`pl-3 h-8 pr-5 truncate text-right 
                    ${bad === true && 'text-bad'} 
                    ${bad === false && 'text-good'}`}
            >
                {amt}
            </td>
        </tr>
    )
}

export default Transaction
