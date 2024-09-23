import toCurrencyString from '~/utils/toCurrencyString'
import Icon from '../icons/Icon'
import { useModal } from '~/context/ModalContext'
import TransactionForm from '../budget/TransactionForm'
import ReconcileForm from './ReconcileForm'
import { BasicBudgetType, FullAccountType } from '~/prisma/fullAccountData'
import { accountTotalTransactions } from '~/utils/budgetValues'

type AccountTopBarProps = {
    accountData: FullAccountType
    basicBudgetData: BasicBudgetType
}

const BigNumber = ({ number, label }: { number: number; label: string }) => {
    return (
        <div className="flex flex-col w-fit items-center pb-0.5">
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

const AccountTopBar = ({
    basicBudgetData,
    accountData,
}: AccountTopBarProps) => {
    const totalTransactions = accountTotalTransactions(accountData)
    const balance = accountData.initialBalance + totalTransactions

    const { setActive, setModalChildren, setModalTitle } = useModal()
    const onTransacClick = () => {
        setModalChildren(
            <TransactionForm
                basicBudgetData={basicBudgetData}
                defaultAccount={accountData}
            />
        )
        setModalTitle('Log Transaction')
        setActive(true)
    }

    const onReconcileClick = () => {
        setModalChildren(
            <ReconcileForm accountData={accountData} accountBalance={balance} />
        )
        setModalTitle('Reconcile Account')
        setActive(true)
    }

    return (
        <div className="border-y border-subtle w-full flex items-center gap-10 px-4 py-2">
            <BigNumber number={balance} label="Current Balance" />
            <div className="flex gap-4 ml-auto">
                <TopBarButton onClick={onReconcileClick}>
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
