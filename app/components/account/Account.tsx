import { FullAccountDataType } from '~/prisma/fullAccountData'
import Icon from '../icons/Icon'
import { Link } from '@remix-run/react'
import { useTheme } from '~/context/ThemeContext'
import AccountTopBar from './AccountTopBar'
import AccountTransactions from './AccountTransactions'
import { useModal } from '~/context/ModalContext'
import AccountForm from './AccountForm'
import { Budget } from '@prisma/client'

type AccountProps = {
    accountData: FullAccountDataType
    budgetBasicInfo: Pick<Budget, 'id' | 'name'>[]
}

const Account = ({ accountData, budgetBasicInfo }: AccountProps) => {
    const { theme } = useTheme()
    const hoverThemeStyle =
        theme === 'DARK'
            ? 'group-hover:stroke-light'
            : 'group-hover:stroke-dark'

    const { setActive, setModalChildren, setModalTitle } = useModal()
    const onEditClick = () => {
        setModalTitle('Edit Account Info')
        setModalChildren(
            <AccountForm budgets={budgetBasicInfo} editAccount={accountData} />
        )
        setActive(true)
    }

    return (
        <div className="w-full h-full min-w-[600px] flex flex-col">
            <div className="flex flex-col w-full p-4">
                <button
                    className="text-4xl font-work-black text-left flex items-center gap-4 group w-fit"
                    onClick={onEditClick}
                >
                    <span className="text-4xl font-work-black group-hover:opacity-90 transition">
                        {accountData.name}
                    </span>
                    <Icon
                        type="edit"
                        className={`size-6 stroke-subtle ${hoverThemeStyle} transition`}
                        interactive
                    />
                </button>
                <p>
                    Account for budget{' '}
                    <Link
                        className={`underline hover:opacity-85 transition`}
                        to={`/budget/${accountData.budgetId}`}
                    >
                        {accountData.budget.name}
                    </Link>
                    .
                </p>
            </div>
            <AccountTopBar accountData={accountData} />
            <AccountTransactions accountData={accountData} />
        </div>
    )
}

export default Account
