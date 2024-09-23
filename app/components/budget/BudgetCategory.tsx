import BudgetItem from './BudgetItem'
import Icon from '../icons/Icon'
import { useTheme } from '~/context/ThemeContext'
import {
    Link,
    useFetcher,
    useNavigate,
    useSearchParams,
} from '@remix-run/react'
import { FullBudgetType } from '~/prisma/fullBudgetData'
import { useModal } from '~/context/ModalContext'
import DeleteForm from '../DeleteForm'
import { useFindRelation } from '~/context/BudgetDataContext'
import { useEffect } from 'react'
import { useBudgetUX } from '~/context/BudgetUXContext'

type BudgetCategoryProps = {
    budgetCategory: FullBudgetType['budgetCategories'][number]
}

const BudgetCategory = ({ budgetCategory }: BudgetCategoryProps) => {
    const budgetItems = useFindRelation(
        'budgetItems',
        'budgetCategoryId',
        budgetCategory.id
    )

    const budgetItemComponents = budgetItems.map((budgetItem) => {
        return <BudgetItem budgetItem={budgetItem} key={budgetItem.id} />
    })

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

    const onDeleteClick = () => {
        navigate(budgetCategory.id)
        setModalTitle('Confirm Deletion')
        setModalChildren(
            <DeleteForm
                deleteItemName={budgetCategory.name}
                fetcherAction="/api/budCat/delete"
                fetcherTarget={{ budgetCategoryId: budgetCategory.id }}
                onSubmitLoad={() =>
                    navigate(`/budget/${budgetCategory.budgetId}`)
                } //  <-- doesn't matter since auto-navigates back anyway
            >
                <span>
                    All budget items (and transactions to and from) under this
                    category will also be deleted.
                </span>
            </DeleteForm>
        )
        setActive(true)
    }

    const { theme } = useTheme()
    const themeStyle =
        theme === 'DARK' ? 'hover:stroke-light' : 'hover:stroke-dark'
    const altThemeStyle = theme === 'DARK' ? 'bg-dark' : 'bg-light'

    const link = `/budget/${budgetCategory.budgetId}/c/${budgetCategory.id}`

    const { budgetUX, updateBudgetUX } = useBudgetUX()

    const onEditClick = () => {
        updateBudgetUX({
            focus: 'catname',
        })
    }

    return (
        <>
            <div
                className={`px-3 flex justify-end items-center gap-2 min-h-10 border-collapse group overflow-y-hidden ${altThemeStyle}`}
            >
                <Link
                    to={link}
                    className="font-work-bold text-xl mr-auto hover:cursor-pointer"
                >
                    {budgetCategory.name}
                </Link>
                <button onClick={onAddClick}>
                    <Icon
                        type="plus-circle"
                        className={`size-6 stroke-subtle ${themeStyle} transition`}
                        interactive
                    />
                </button>
                <Link to={link} onClick={onEditClick}>
                    <Icon
                        type="edit"
                        className={`size-6 stroke-subtle ${themeStyle} transition`}
                        interactive
                    />
                </Link>
                <button onClick={onDeleteClick}>
                    <Icon
                        type="trash"
                        className={`size-6 stroke-subtle ${themeStyle} transition`}
                        interactive
                    />
                </button>
            </div>
            {budgetItemComponents.length > 0 ? (
                <div className="divide-y divide-subtle">
                    {...budgetItemComponents}
                </div>
            ) : (
                <div className="w-full min-h-2" />
            )}
        </>
    )
}

export default BudgetCategory
