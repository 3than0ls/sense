import { useFetcher } from '@remix-run/react'
import DeleteButton from '../DeleteButton'
import Exclamation from '../Exclamation'

type DeleteBudgetFormProps = {
    budgetName: string
    budgetId: string
}

const DeleteBudgetForm = ({ budgetName, budgetId }: DeleteBudgetFormProps) => {
    const fetcher = useFetcher()
    const onDelete = () => {
        fetcher.submit(
            {
                budgetId: budgetId,
            },
            {
                action: '/api/bud/delete',
            }
        )
    }

    return (
        <div className="flex flex-col gap-4 w-96">
            <span className="text-lg w-fit px-2">
                Are you sure you want to delete{' '}
                <span className="font-work-bold">{budgetName}</span>?
            </span>
            <Exclamation divClassName="px-2">
                <span>
                    All data will be deleted, including accounts that were
                    created for this budget.{' '}
                    <span className="font-work-bold">
                        This action is irreversible!
                    </span>
                </span>
            </Exclamation>
            <DeleteButton className="mt-3" onClick={onDelete}>
                Yes, I want to delete this budget.
            </DeleteButton>
        </div>
    )
}

export default DeleteBudgetForm
