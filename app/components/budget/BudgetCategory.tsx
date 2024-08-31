import BudgetItem from './BudgetItem'
import Icon from '../icons/Icon'
import { useTheme } from '~/context/ThemeContext'
import { Link, useFetcher, useNavigate } from '@remix-run/react'
import { FullBudgetDataType } from '~/prisma/fullBudgetData'
import { useModal } from '~/context/ModalContext'
import DeleteCategoryForm from './DeleteCategoryForm'

type BudgetCategoryProps = {
    budgetCategory: FullBudgetDataType['budgetCategories'][number]
}

const BudgetCategory = ({ budgetCategory }: BudgetCategoryProps) => {
    const budgetItemComponents = Array.from(
        budgetCategory.budgetItems,
        (budgetItem) => {
            return <BudgetItem budgetItem={budgetItem} key={budgetItem.id} />
        }
    )

    const fetcher = useFetcher()
    const navigate = useNavigate()
    const { setActive, setModalChildren, setModalTitle } = useModal()

    const onAddClick = () => {
        fetcher.submit(
            {
                budgetCategoryId: budgetCategory.id,
            },
            { action: '/api/budItem/create', method: 'POST' }
        )
    }
    const onEditClick = () => navigate(budgetCategory.id)

    const onDeleteClick = () => {
        navigate(budgetCategory.id)
        setModalTitle('Confirm Deletion')
        setModalChildren(<DeleteCategoryForm budgetCategory={budgetCategory} />)
        setActive(true)
    }

    const { theme } = useTheme()
    const themeStyle =
        theme === 'DARK' ? 'hover:stroke-light' : 'hover:stroke-dark'
    const altThemeStyle = theme === 'DARK' ? 'bg-dark' : 'bg-light'

    return (
        <>
            <div
                className={`px-4 flex justify-end items-center min-h-10 border-collapse group overflow-y-hidden ${altThemeStyle}`}
            >
                <Link
                    to={budgetCategory.id}
                    className="font-work-bold text-xl mr-auto hover:cursor-pointer"
                >
                    {budgetCategory.name}
                </Link>
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
                <button onClick={onDeleteClick}>
                    <Icon
                        type="trash"
                        className={`size-6 stroke-subtle ${themeStyle} transform translate-y-16 group-hover:translate-y-0 transition ml-2`}
                        interactive
                    />
                </button>
            </div>
            {budgetItemComponents.length > 0 ? (
                <div className="divide-y divide-subtle">
                    {...budgetItemComponents}
                </div>
            ) : (
                <div className="w-full h-2" />
            )}
        </>
    )
}

export default BudgetCategory
