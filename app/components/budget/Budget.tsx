import BudgetProvider, { BudgetFullType } from '~/context/BudgetContext'
import BudgetCategory from './BudgetCategory'
import Icon from '../icons/Icon'
import { useTheme } from '~/context/ThemeContext'

type BudgetProps = {
    budgetData: BudgetFullType
}

const Budget = ({ budgetData }: BudgetProps) => {
    // console.log(budgetData)
    const { createdAt, description, name, budgetCategories } = budgetData

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
        <BudgetProvider budgetData={budgetData}>
            <div className="w-full min-w-[600px] flex flex-col">
                <div className={`flex gap-6 p-4 items-center`}>
                    <div className="flex flex-col w-full">
                        <span className="text-4xl font-work-black">{name}</span>
                        <span>{description}</span>
                    </div>
                    <Icon type="edit" interactive />
                </div>
                <div className="flex flex-grow overflow-auto">
                    <div
                        className={`flex flex-col divide-y ${themeStyles} flex-grow overflow-y-auto`}
                    >
                        <div className="flex flex-row justify-end gap-4 px-4 text-right">
                            <span className="w-56 flex-grow text-left">
                                {name}
                            </span>
                            <span className="w-32">Assigned</span>
                            <span className="w-32">Balance</span>
                            <span className="w-32">Target</span>
                        </div>
                        {...budgetCategoryComponents}
                    </div>
                    <div className="w-1/4">some other menuthing her</div>
                </div>
            </div>
        </BudgetProvider>
    )
}

export default Budget
