import { FullBudgetDataType } from '~/prisma/fullBudgetData'
import DeleteButton from '../DeleteButton'
import { BudgetCategory } from '@prisma/client'
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
                Are you sure you want to delete{' '}
                <span className="font-work-bold">{budgetCategory.name}</span>?
            </span>
            <Exclamation divClassName="px-2">
                <span>
                    This will also delete all budget items under this category.{' '}
                    <span className="font-work-bold">
                        This action is irreversible!
                    </span>
                </span>
            </Exclamation>
            <DeleteButton
                className="mt-3"
                onClick={() => alert('delete category')}
            >
                Yes, I want to delete this category.
            </DeleteButton>
        </div>
    )
}

export default DeleteCategoryForm
