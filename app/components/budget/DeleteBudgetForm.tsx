import { FullBudgetDataType } from '~/prisma/fullBudgetData'
import DeleteButton from '../DeleteButton'
import { Budget } from '@prisma/client'
import Exclamation from '../Exclamation'

type DeleteBudgetFormProps = {
    budgetName: string
}

const DeleteBudgetForm = ({ budgetName }: DeleteBudgetFormProps) => {
    return (
        <div className="flex flex-col gap-4 w-96">
            <span className="text-lg w-fit px-2">
                Are you sure you want to delete {budgetName}?
            </span>
            <Exclamation divClassName="px-2">
                <span>
                    All data will be deleted, including accounts that were
                    created for this budget.
                    <span className="font-work-bold">
                        This action is irreversible!
                    </span>
                </span>
            </Exclamation>
            <DeleteButton
                className="mt-3"
                onClick={() => alert('delete budget')}
            >
                Yes, I want to delete this budget.
            </DeleteButton>
        </div>
    )
}

export default DeleteBudgetForm
