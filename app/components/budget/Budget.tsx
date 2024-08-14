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
            <div className="h-full flex flex-col flex-grow overflow-hidden">
                <div className={`flex h-auto gap-6 p-4 items-center`}>
                    <div className="flex flex-col w-full">
                        <span className="text-4xl font-work-black">{name}</span>
                        <span>{description}</span>
                    </div>
                    <Icon type="edit" interactive />
                </div>
                <div className="flex h-full">
                    <table
                        className={`flex flex-col divide-y ${themeStyles} flex-grow overflow-auto`}
                    >
                        <th className="flex flex-row justify-end gap-4 px-4 text-right">
                            <td className="w-56 flex-grow text-left">{name}</td>
                            <td className="w-32">Assigned</td>
                            <td className="w-32">Balance</td>
                            <td className="w-32">Target</td>
                        </th>
                        {...budgetCategoryComponents}
                    </table>
                    <div className="w-1/4">some other menuthing her</div>
                </div>
            </div>
        </BudgetProvider>
    )
}

export default Budget
