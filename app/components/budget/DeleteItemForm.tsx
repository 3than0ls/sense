import { FullBudgetDataType } from '~/prisma/fullBudgetData'
import DeleteButton from '../DeleteButton'
import { BudgetItem } from '@prisma/client'
import Exclamation from '../Exclamation'

type DeleteItemFormProps = {
    budgetItem:
        | FullBudgetDataType['budgetCategories'][number]['budgetItems'][number]
        | BudgetItem
}

const DeleteItemForm = ({ budgetItem }: DeleteItemFormProps) => {
    return (
        <div className="flex flex-col gap-4 w-96">
            <span className="text-lg w-fit px-2">
                Are you sure you want to delete {budgetItem.name}?
            </span>
            <Exclamation divClassName="px-2">
                <span>
                    Previous transactions to this account will still exist, but
                    the item will no longer appear in your budget.{' '}
                    <span className="font-work-bold">
                        This action is irreversible!
                    </span>
                </span>
            </Exclamation>
            <DeleteButton className="mt-3" onClick={() => alert('delete item')}>
                Yes, I want to delete this item.
            </DeleteButton>
        </div>
    )
}

export default DeleteItemForm
