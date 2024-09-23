import { Outlet, useParams } from '@remix-run/react'
import Icon from '../icons/Icon'
import { currentMonthBudgetValues } from '~/utils/budgetValues'
import { FullBudgetType } from '~/prisma/fullBudgetData'
import { useModal } from '~/context/ModalContext'
import TransactionForm from './TransactionForm'
import toCurrencyString from '~/utils/toCurrencyString'
import { BudgetItem } from '@prisma/client'
import { useTheme } from '~/context/ThemeContext'

type BudgetMenuProps = {
    budgetData: FullBudgetType
}

const BudgetMenuCard = ({ value, label }: { value: number; label: string }) => {
    return (
        <div className="bg-primary flex-grow flex flex-col text-center py-3 px-2 rounded-lg">
            <span className="font-work-bold text-xl max-w-40 truncate">
                {toCurrencyString(value)}
            </span>
            <span className="text-sm">{label}</span>
        </div>
    )
}

const BudgetMenuAlert = ({ children }: { children: React.ReactNode }) => {
    const { theme } = useTheme()
    const iconThemeStyle = theme === 'DARK' ? 'fill-dark' : 'fill-light'
    return (
        <div
            className={`relative text-bad border border-bad animate-fade-in min-w-full bg-opacity-20 flex flex-col py-3 px-2 rounded-lg bg-bad text-base leading-snug`}
        >
            {children}
            <div className="absolute -top-3 -right-3">
                <Icon
                    type="exclamation-circle"
                    className={`size-8 ${iconThemeStyle} text-bad`}
                />
            </div>
        </div>
    )
}

const BudgetMenu = ({ budgetData }: BudgetMenuProps) => {
    const { totalCash, freeCash } = currentMonthBudgetValues(budgetData)

    const params = useParams()
    const { setActive, setModalChildren, setModalTitle } = useModal()
    const onTransacClick = () => {
        let defaultItem: FullBudgetType['budgetItems'][number] | undefined =
            undefined
        if (params['budgetItemId'] !== undefined) {
            defaultItem = budgetData.budgetItems.find(
                (bItem) => bItem.id === params.budgetItemId
            )
        }

        setModalChildren(
            <TransactionForm
                basicBudgetData={budgetData}
                defaultBudgetItem={defaultItem}
            />
        )
        setModalTitle('Log Transaction')
        setActive(true)
    }

    return (
        <div className="min-w-80 w-80 h-full flex flex-col gap-4 p-4 border-t border-l border-subtle overflow-y-auto scrollbar-custom">
            <div className="flex gap-4 w-full">
                <BudgetMenuCard label="Free Cash" value={freeCash} />
                <BudgetMenuCard label="Total Cash" value={totalCash} />
            </div>
            <div className="w-full flex flex-col gap-4">
                <button
                    onClick={onTransacClick}
                    className="w-full bg-primary hover:bg-opacity-60 transition-all duration-400 ease-in-out rounded-lg font-work-bold p-1.5 flex justify-center items-center"
                >
                    <Icon type="currency-dollar" className="size-8 mx-2" />
                    <span>Add transaction</span>
                </button>
            </div>
            {totalCash < 0 && (
                <BudgetMenuAlert>
                    <span className="font-work-bold underline">
                        Total cash is less than zero!
                    </span>
                    <span className="leading-tight text-base">
                        Check your accounts to see if you have an error.
                    </span>
                </BudgetMenuAlert>
            )}
            {freeCash < 0 && (
                <BudgetMenuAlert>
                    <span className="font-work-bold underline">
                        Free cash is less than zero!
                    </span>
                    <span className="leading-tight text-base">
                        You&apos;ve over-assigned your money.
                    </span>
                </BudgetMenuAlert>
            )}

            {freeCash > totalCash && (
                <BudgetMenuAlert>
                    <span className="font-work-bold underline">
                        Free cash is greater than total cash!
                    </span>
                    <span className="leading-tight text-base">
                        You&apos;ve likely over-spent the amount assigned to an
                        item, and don&apos;t have the cash anywhere to cover it.
                    </span>
                </BudgetMenuAlert>
            )}
            <Outlet context={budgetData} />
        </div>
    )
}

export default BudgetMenu
