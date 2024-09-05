import { FullBudgetDataType } from '~/prisma/fullBudgetData'
import DeleteButton from '../DeleteButton'
import { BudgetItem } from '@prisma/client'
import Exclamation from '../Exclamation'
import { useFetcher, useNavigate } from '@remix-run/react'
import { useModal } from '~/context/ModalContext'

type DeleteItemFormProps = {
    budgetItem:
        | FullBudgetDataType['budgetCategories'][number]['budgetItems'][number]
        | BudgetItem
}

const DeleteItemForm = ({ budgetItem }: DeleteItemFormProps) => {
    const fetcher = useFetcher()
    const navigate = useNavigate()
    const { setActive } = useModal()
    const onDelete = () => {
        fetcher.submit(
            {
                budgetItemId: budgetItem.id,
            },
            {
                action: '/api/budItem/delete',
                method: 'POST',
            }
        )
        setActive(false)
        navigate(`/budget/${budgetItem.budgetId}`)
    }

    return (
        <div className="flex flex-col gap-4 text-lg w-96">
            <span className="w-fit px-2">
                Are you sure you want to delete{' '}
                <span className="font-work-bold">{budgetItem.name}</span>?
            </span>
            <Exclamation divClassName="px-2">
                <span>
                    All transactions to/from this item will also be deleted! You
                    may have to manually reconcile your account balance if you
                    do this.{' '}
                    <span className="font-work-bold">
                        This action is irreversible!
                    </span>
                </span>
            </Exclamation>
            <DeleteButton className="mt-3" onClick={onDelete}>
                Yes, I want to delete this item.
            </DeleteButton>
        </div>
    )
}

export default DeleteItemForm
