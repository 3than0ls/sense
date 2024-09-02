import { FullBudgetDataType } from '~/prisma/fullBudgetData'
import DeleteButton from '../DeleteButton'
import { BudgetCategory } from '@prisma/client'
import Icon from '../icons/Icon'
import Exclamation from '../Exclamation'

type DeleteCategoryFormProps = {
    budgetCategory:
        | FullBudgetDataType['budgetCategories'][number]
        | BudgetCategory
}

const DeleteCategoryForm = ({ budgetCategory }: DeleteCategoryFormProps) => {
    return (
        <div className="flex flex-col gap-4 w-96">
            <span className="text-lg w-fit px-2">
                Are you sure you want to delete {budgetCategory.name}?
            </span>
            <Exclamation divClassName="px-2">
                <span>
                    This will also delete all budget items under this category.{' '}
                    <span className="font-work-bold">
                        This action is irreversible!
                    </span>
                </span>
            </Exclamation>
            <DeleteButton onClick={() => alert('delete category')}>
                Yes, I want to delete this category.
            </DeleteButton>
        </div>
    )
}

export default DeleteCategoryForm
