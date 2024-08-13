import BudgetProvider, { BudgetFullType } from '~/context/BudgetContext'
import BudgetCategory from './BudgetCategory'
import Edit from '../icons/Edit'
import Icon from '../icons/Icon'

type BudgetProps = {
    budgetData: BudgetFullType
}

const Budget = ({ budgetData }: BudgetProps) => {
    console.log(budgetData)
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

    // TODO: add editing buttons for all this

    return (
        <BudgetProvider budgetData={budgetData}>
            <div className="flex gap-6 bg-white p-4 items-center">
                <div className="flex flex-col">
                    <span className="text-4xl font-work-black">{name}</span>
                    <span>{description}</span>
                </div>
                <Icon type="edit" />
            </div>
            <div className="overflow-x-auto">{...budgetCategoryComponents}</div>
        </BudgetProvider>
    )
}

export default Budget
