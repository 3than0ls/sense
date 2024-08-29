import BudgetProvider, { BudgetFullType } from '~/context/BudgetContext'
import BudgetCategory from './BudgetCategory'
import Icon from '../icons/Icon'
import { useTheme } from '~/context/ThemeContext'
import BudgetMenu from './BudgetMenu'
import { FullBudgetDataType } from '~/prisma/fullBudgetData'

type BudgetProps = {
    budgetData: FullBudgetDataType
}

const Budget = ({ budgetData }: BudgetProps) => {
    const { description, name, budgetCategories } = budgetData

    const budgetCategoryComponents = Array.from(
        budgetCategories,
        (budgetCategory) => {
            return (
                <BudgetCategory
                    budgetCategory={budgetCategory}
                    key={budgetCategory.id}
                />
            )
        }
    )

    const { theme } = useTheme()
    const themeStyles =
        theme === 'DARK' ? 'bg-black divide-subtle' : 'bg-white divide-subtle'

    // TODO: add editing buttons for all this

    return (
        <div className="w-full h-full min-w-[600px] flex flex-col">
            <div className={`flex gap-6 p-4 items-center`}>
                <div className="flex flex-col w-full">
                    <span className="text-4xl font-work-black">{name}</span>
                    <span>{description}</span>
                </div>
                <Icon type="edit" interactive />
            </div>
            <div className="flex flex-grow overflow-auto">
                <div className="relative flex-grow flex flex-col">
                    <div
                        className={`flex flex-col divide-y ${themeStyles} flex-grow overflow-y-auto`}
                    >
                        <div
                            className={`absolute bg-inherit z-50 bottom-0 flex w-full justify-end gap-4 text-right px-4 ${themeStyles}`}
                        >
                            <span className="w-56 text-left flex-grow font-work-bold">
                                {name}
                            </span>
                            <span className="w-32">Balance</span>
                            <span className="w-32">Assigned</span>
                            <span className="w-32">Target</span>
                        </div>
                        {...budgetCategoryComponents}
                    </div>
                </div>
                <BudgetMenu budgetData={budgetData} />
            </div>
        </div>
    )
}

export default Budget
