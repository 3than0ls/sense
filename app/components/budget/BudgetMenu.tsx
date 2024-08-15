import { Link, Outlet } from '@remix-run/react'
import { BudgetFullType } from '~/context/BudgetContext'
import Icon from '../icons/Icon'

type BudgetMenuProps = {
    budgetData: BudgetFullType
}

const BudgetMenuCard = ({ value, label }: { value: number; label: string }) => {
    return (
        <div className="bg-primary flex-grow flex flex-col text-center p-4 rounded-lg">
            <span className="font-work-bold text-xl">${value}</span>
            <span className="text-sm">{label}</span>
        </div>
    )
}

const BudgetMenuLink = ({
    children,
    href,
}: {
    children: React.ReactNode
    href: string
}) => {
    return (
        <Link
            className="w-full bg-primary hover:bg-opacity-60 transition-all duration-400 ease-in-out rounded-lg font-work-bold p-3 flex justify-center items-center"
            to={href}
        >
            {children}
        </Link>
    )
}

const BudgetMenu = ({ budgetData }: BudgetMenuProps) => {
    const totalCash = 1000
    const freeCash = 500

    return (
        <div className="w-1/4 flex flex-col gap-6 p-4">
            <div className="flex gap-6 w-full">
                <BudgetMenuCard label="Free Cash" value={freeCash} />
                <BudgetMenuCard label="Total Cash" value={totalCash} />
            </div>
            <div className="w-full flex flex-col gap-4">
                <BudgetMenuLink href="transaction">
                    <Icon type="currency-dollar" className="size-8 mx-2" />
                    <span>Add transaction</span>
                </BudgetMenuLink>
                {/* <BudgetMenuLink href="assign">
                    <Icon type="plus-circle" className="size-8 mx-2" />
                    <span>Assign free cash</span>
                </BudgetMenuLink> */}
            </div>
            <Outlet />
        </div>
    )
}

export default BudgetMenu
