import { useFetcher, Link, useSearchParams } from '@remix-run/react'
import React from 'react'
import { useModal } from '~/context/ModalContext'
import { useTheme } from '~/context/ThemeContext'
import { FullBudgetType } from '~/prisma/fullBudgetData'
import categoryNameSchema from '~/zodSchemas/budgetCategory'
import DeleteButton from '../DeleteButton'
import DeleteForm from '../DeleteForm'
import Divider from '../Divider'
import Icon from '../icons/Icon'
import BudgetMenuForm from './BudgetMenuForm'
import { useFindRelation } from '~/context/BudgetDataContext'
import { useBudgetUX } from '~/context/BudgetUXContext'

type BudgetCategoryMenuProps = {
    budgetCategory: FullBudgetType['budgetCategories'][number]
}

const BudgetCategoryMenu = ({ budgetCategory }: BudgetCategoryMenuProps) => {
    const { theme } = useTheme()
    const themeStyle = theme === 'DARK' ? 'bg-black' : 'bg-white'
    const altThemeStyle = theme === 'DARK' ? 'bg-dark' : 'bg-light'

    const fetcher = useFetcher()

    const budgetItems = useFindRelation(
        'budgetItems',
        'budgetCategoryId',
        budgetCategory.id
    )

    const budgetItemComponents = budgetItems.map((budgetItem) => {
        return (
            <Link
                to={`/budget/${budgetCategory.budgetId}/i/${budgetItem.id}`}
                key={budgetItem.id}
                className={`${altThemeStyle} rounded-xl hover:bg-opacity-80 transition px-4 py-2 flex justify-between items-center`}
            >
                <span className="mr-1.5 w-full truncate">
                    {budgetItem.name}
                </span>
                <Icon type="edit" className="size-5 stroke-subtle" />
            </Link>
        )
    })

    const createNewBudgetItem: React.FormEventHandler<HTMLFormElement> = async (
        e
    ) => {
        e.preventDefault()
        fetcher.submit(
            {
                budgetCategoryId: budgetCategory.id,
            },
            { action: '/api/budItem/create', method: 'POST' }
        )
    }

    const { setModalChildren, setModalTitle, setActive } = useModal()
    const onDeleteClick = () => {
        setModalTitle('Confirm Deletion')
        setModalChildren(
            <DeleteForm
                deleteItemName={budgetCategory.name}
                fetcherAction="/api/budCat/delete"
                fetcherTarget={{ budgetCategoryId: budgetCategory.id }}
                // onSubmitLoad={() => navigate(`/budget/${budgetItem.budgetId}`)} //  <-- doesn't matter since auto-navigates back anyway
            >
                <span>
                    All budget items (and transactions to and from) under this
                    category will also be deleted.
                </span>
            </DeleteForm>
        )
        setActive(true)
    }

    const focus = useBudgetUX().budgetUX.focus

    // ideally should be moved to it's own component
    return (
        <div
            className={`flex flex-col gap-4 size-full p-4 text-sm ${themeStyle} rounded-xl min-w-full h-fit`}
        >
            <div className="flex flex-col w-full justify-center items-center">
                <BudgetMenuForm
                    key={budgetCategory.name}
                    defaultValue={budgetCategory.name}
                    label="Name"
                    name="name"
                    schema={categoryNameSchema}
                    action="/api/budCat/rename"
                    itemUuid={budgetCategory.id}
                    focus={focus === 'catname'}
                />
            </div>
            <Divider />
            <div className="w-full flex flex-col gap-1">
                <span className="text-lg ml-2">Items in Category</span>
                <div className="flex flex-col gap-2 min-w-full w-0">
                    {budgetItemComponents}
                </div>
                <fetcher.Form onSubmit={createNewBudgetItem}>
                    <button
                        type="submit"
                        className="bg-primary w-full mt-1 flex justify-center items-center gap-2 rounded-xl hover:bg-opacity-80 transition px-4 py-2"
                    >
                        Create Item
                        <Icon type="plus-circle" className="size-5" />
                    </button>
                </fetcher.Form>
            </div>
            <Divider className="mt-auto border-subtle" />
            <DeleteButton
                className="flex justify-center items-center gap-4 h-10"
                onClick={onDeleteClick}
            >
                Delete Category
                <Icon type="trash" className="size-5" />
            </DeleteButton>
        </div>
    )
}

export default BudgetCategoryMenu
