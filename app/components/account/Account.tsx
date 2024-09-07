import { FullAccountDataType } from '~/prisma/fullAccountData'
import Icon from '../icons/Icon'
import { Link } from '@remix-run/react'
import { useTheme } from '~/context/ThemeContext'
import AccountTopBar from './AccountTopBar'
import AccountTransactions from './AccountTransactions'

type AccountProps = {
    accountData: FullAccountDataType
}

const Account = ({ accountData }: AccountProps) => {
    const { theme } = useTheme()
    const hoverThemeStyle =
        theme === 'DARK'
            ? 'group-hover:stroke-light'
            : 'group-hover:stroke-dark'

    return (
        <div className="w-full h-full min-w-[600px] flex flex-col">
            <div className="flex flex-col w-full p-4">
                <button
                    className="text-4xl font-work-black text-left flex items-center gap-4 group w-fit"
                    onClick={() => {
                        alert('Edit budget name via modal!')
                    }}
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
