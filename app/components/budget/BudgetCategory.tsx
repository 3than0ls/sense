import { BudgetCategoryFullType } from '~/context/BudgetContext'
import BudgetItem from './BudgetItem'
import Icon from '../icons/Icon'
import { useTheme } from '~/context/ThemeContext'

type BudgetCategoryProps = {
    budgetCategory: BudgetCategoryFullType
}

const BudgetCategory = ({ budgetCategory }: BudgetCategoryProps) => {
    const budgetItemComponents = Array.from(
        budgetCategory.budgetItems,
        (budgetItem) => {
            return <BudgetItem budgetItem={budgetItem} key={budgetItem.id} />
        }
    )

    const onAddClick = () => alert('adding item to ' + budgetCategory.name)
    const onEditClick = () => alert('editing ' + budgetCategory.name)

    const { theme } = useTheme()
    const themeStyle =
        theme === 'DARK' ? 'hover:stroke-light' : 'hover:stroke-dark'

    return (
        <>
            <div className="px-4 flex justify-end items-center min-h-10 border-collapse group overflow-y-hidden">
                <span className="font-work-bold text-xl mr-auto hover:cursor-pointer">
                    {budgetCategory.name}
                </span>
                <button onClick={onAddClick}>
                    <Icon
                        type="plus-circle"
                        className={`size-6 stroke-subtle ${themeStyle} transform translate-y-16 group-hover:translate-y-0 transition ml-2`}
                        interactive
                    />
                </button>
                <button onClick={onEditClick}>
                    <Icon
                        type="edit"
                        className={`size-6 stroke-subtle ${themeStyle} transform translate-y-16 group-hover:translate-y-0 transition ml-2`}
                        interactive
                    />
                </button>
            </div>
            {/* <hr className={`border-none h-[4px] ${themeStyle} mb-2`} /> */}
            {...budgetItemComponents}
        </>
    )
}

export default BudgetCategory
