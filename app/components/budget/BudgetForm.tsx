import { FieldValues, SubmitHandler } from 'react-hook-form'
import Input from '../form/Input'
import useRemixForm from '~/hooks/useRemixForm'
import RemixForm from '../RemixForm'
import Submit from '../form/Submit'
import { useModal } from '~/context/ModalContext'
import { budgetSchema } from '~/zodSchemas/budgetInfo'
import Divider from '../Divider'
import DeleteButton from '../DeleteButton'
import DeleteForm from '../DeleteForm'
import { useNavigate } from '@remix-run/react'
import Icon from '../icons/Icon'
import { useEffect } from 'react'
import { FullBudgetDataType } from '~/prisma/fullBudgetData'

type BudgetFormProps = {
    editBudget?: FullBudgetDataType
}

const BudgetForm = ({ editBudget }: BudgetFormProps) => {
    const { setActive, setModalTitle, setModalChildren } = useModal()

    // may have to use an onChange
    const { methods, fetcher } = useRemixForm(budgetSchema, 'onChange')

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        if (editBudget) {
            if (
                data.name !== editBudget.name ||
                data.description !== editBudget.description
            ) {
                fetcher.submit(
                    {
                        ...data,
                        budgetId: editBudget.id,
                    },
                    {
                        action: '/api/bud/edit',
                        method: 'POST',
                    }
                )
            }
        } else {
            fetcher.submit(data, { action: '/api/bud/create', method: 'POST' })
        }
    }

    // code taken from AccountForm, exact same, see comment there on why this is
    useEffect(() => {
        if (fetcher.state === 'loading') {
            setActive(false)
        }
    }, [fetcher, setActive])

    const navigate = useNavigate()
    const onDeleteClick = () => {
        if (editBudget) {
            setModalTitle('Confirm Deletion')
            setModalChildren(
                <DeleteForm
                    deleteItemName={editBudget.name}
                    fetcherAction="/api/bud/delete"
                    fetcherTarget={{ budgetId: editBudget.id }}
                    onSubmitLoad={() => navigate(`/budget/`)} //  <-- doesn't matter since auto-navigates back anyway
                >
                    <span>
                        Everything will be deleted, including all accounts
                        created under this budget.
                    </span>
                </DeleteForm>
            )
            setActive(true)
        }
    }

    return (
        <RemixForm
            className="min-w-96 flex flex-col gap-2"
            methods={methods}
            fetcher={fetcher}
            onSubmit={onSubmit}
            noAction={true}
        >
            <Input
                name="name"
                label="Name"
                placeholder="Name"
                defaultValue={editBudget?.name}
            />
            <Input
                name="description"
                label="Description"
                textArea
                placeholder="Description"
                defaultValue={editBudget?.description ?? undefined}
            />
            <Submit
                disabled={
                    !!methods.formState.errors['name'] ||
                    fetcher.state === 'submitting'
                }
                className="w-full py-2 rounded-xl mt-3 mb-2"
            >
                {editBudget ? 'Update Budget' : 'Create Budget'}
                {fetcher.state === 'submitting' && (
                    <Icon
                        type="spinner"
                        color="#fff"
                        className="size-6 animate-spin flex items-center justify-center"
                    />
                )}
            </Submit>
            {editBudget && (
                <div className="w-full mt-4 flex flex-col gap-4">
                    <Divider themed />
                    <DeleteButton onClick={onDeleteClick}>
                        Delete Budget
                    </DeleteButton>
                </div>
            )}
        </RemixForm>
    )
}

export default BudgetForm
