import { FullAccountDataType } from '~/prisma/fullAccountData'
import { accountTotalTransactions } from '~/utils/accountValues'
import toCurrencyString from '~/utils/toCurrencyString'
import Icon from '../icons/Icon'
import { useModal } from '~/context/ModalContext'
import TransactionForm from '../budget/TransactionForm'

type AccountTopBarProps = {
    accountData: FullAccountDataType
}

const BigNumber = ({ number, label }: { number: number; label: string }) => {
    return (
        <div className="flex flex-col w-fit items-center py-0.5">
            <span className="text-2xl leading-[1.1]">
                {toCurrencyString(number)}
            </span>
            <span className="text-xs leading-[1.1]">{label}</span>
        </div>
    )
}

const TopBarButton = ({
    onClick,
    children,
}: {
    onClick: () => void
    children: React.ReactNode
}) => {
    return (
        <button
            onClick={onClick}
            className="w-fit text-sm bg-primary hover:bg-opacity-85 transition-all duration-400 ease-in-out rounded-lg font-work-bold px-4 py-2 flex justify-center items-center gap-2"
        >
            {children}
        </button>
    )
}

const AccountTopBar = ({ accountData }: AccountTopBarProps) => {
    const totalTransactions = accountTotalTransactions(accountData)
    const balance = accountData.initialBalance + totalTransactions

    const { setActive, setModalChildren, setModalTitle } = useModal()
    const onTransacClick = () => {
        setModalChildren(
            <TransactionForm
                budgetId={accountData.budgetId}
                defaultAccount={accountData}
            />
        )
        setModalTitle('Log Transaction')
        setActive(true)
    }

    return (
        <div className="border-y border-subtle w-full flex items-center gap-10 px-4 py-2">
            {/* <BigNumber
                number={accountData.initialBalance}
                label="Initial Balance"
            />
            <span className="text-4xl leading-none  text-subtle">
                {totalTransactions >= 0 ? '-' : '+'}
            </span>
            <BigNumber number={totalTransactions} label="Total Transactions" />
            <span className="text-4xl leading-none  text-subtle">=</span> */}
            <BigNumber number={balance} label="Current Balance" />
            <div className="flex gap-4 ml-auto">
                <TopBarButton onClick={() => alert('reconcile account')}>
                    Reconcile
                    <Icon type="magnifying-glass-circle" className="size-6" />
                </TopBarButton>
                <TopBarButton onClick={onTransacClick}>
                    Add Transaction
                    <Icon type="currency-dollar" className="size-6" />
                </TopBarButton>
            </div>
        </div>
    )
}

export default AccountTopBar
