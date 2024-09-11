import { FullAccountDataType } from '~/prisma/fullAccountData'
import { accountTotalTransactions } from '~/utils/accountValues'
import toCurrencyString from '~/utils/toCurrencyString'

type AccountTopBarProps = {
    accountData: FullAccountDataType
}

const BigNumber = ({ number, label }: { number: number; label: string }) => {
    return (
        <div className="flex flex-col w-fit items-center">
            <span className="text-2xl ">{toCurrencyString(number)}</span>
            <span className="text-sm">{label}</span>
        </div>
    )
}

const AccountTopBar = ({ accountData }: AccountTopBarProps) => {
    const totalTransactions = accountTotalTransactions(accountData)
    const balance = accountData.initialBalance - totalTransactions

    return (
        <div className="border-y border-subtle w-full p-4 flex items-center justify-around gap-10">
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
        </div>
    )
}

export default AccountTopBar
