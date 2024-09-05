import { Link, Outlet } from '@remix-run/react'
import Icon from '../icons/Icon'
import {
    budgetTotalAccounts,
    budgetTotalAssignments,
} from '~/utils/budgetValues'
import { FullBudgetDataType } from '~/prisma/fullBudgetData'

type BudgetMenuProps = {
    budgetData: FullBudgetDataType
}

const BudgetMenuCard = ({ value, label }: { value: number; label: string }) => {
    return (
        <div className="bg-primary flex-grow flex flex-col text-center p-3 rounded-lg">
            <span className="font-work-bold text-xl">${value.toFixed(2)}</span>
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
            className="w-full bg-primary hover:bg-opacity-60 transition-all duration-400 ease-in-out rounded-lg font-work-bold p-1.5 flex justify-center items-center"
            to={href}
        >
            {children}
        </Link>
    )
}

const BudgetMenu = ({ budgetData }: BudgetMenuProps) => {
    const totalCash = budgetTotalAccounts(budgetData)
    const assignedCash = budgetTotalAssignments(budgetData)
    const freeCash = totalCash - assignedCash

    return (
        <div className="w-1/4 min-w-fit flex flex-col gap-4 p-4 overflow-auto border-t border-l border-subtle">
            <div className="flex gap-4 w-full">
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
