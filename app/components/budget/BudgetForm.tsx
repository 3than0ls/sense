import { SubmitHandler } from 'react-hook-form'
import Input from '../form/Input'
import useRemixForm from '~/hooks/useRemixForm'
import { budgetSchema, BudgetSchemaType } from '~/zodSchemas/budgetInfo'
import DeleteForm from '../DeleteForm'
import { useNavigate } from '@remix-run/react'
import { FullBudgetType } from '~/prisma/fullBudgetData'
import CreateUpdateModalForm from '../CreateUpdateModalForm'
import { action as budUpdateAction } from '~/routes/api.bud.edit'
import { action as budCreateAction } from '~/routes/api.bud.create'

type BudgetFormProps = {
    editBudget?: FullBudgetType
}

const BudgetForm = ({ editBudget }: BudgetFormProps) => {
    const { methods, fetcher } = useRemixForm<
        BudgetSchemaType,
        typeof budCreateAction | typeof budUpdateAction
    >(budgetSchema, 'onChange')

    const onSubmit: SubmitHandler<BudgetSchemaType> = (data) => {
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

    const navigate = useNavigate()

    return (
        <CreateUpdateModalForm
            fetcher={fetcher}
            methods={methods}
            onSubmit={onSubmit}
            name="Budget"
            type={editBudget ? 'update' : 'create'}
            deleteForm={
                editBudget && (
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
            }
            disable={editBudget && !!methods.formState.errors['name']}
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
        </CreateUpdateModalForm>
    )
}

export default BudgetForm
