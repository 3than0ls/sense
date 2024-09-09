import { FieldValues, SubmitHandler } from 'react-hook-form'
import Input from '../form/Input'
import useRemixForm from '~/hooks/useRemixForm'
import RemixForm from '../RemixForm'
import Submit from '../form/Submit'
import { useModal } from '~/context/ModalContext'
import { budgetInfoFormSchema } from '~/zodSchemas/budgetInfo'
import Divider from '../Divider'
import DeleteButton from '../DeleteButton'
import DeleteForm from '../DeleteForm'
import { useNavigate } from '@remix-run/react'
import Icon from '../icons/Icon'
import { useEffect } from 'react'

type BudgetInfoFormProps = {
    name: string
    description: string
    budgetId: string
}

const BudgetInfoForm = ({
    name,
    description,
    budgetId,
}: BudgetInfoFormProps) => {
    const { setActive, setModalTitle, setModalChildren } = useModal()

    // may have to use an onChange
    const { methods, fetcher } = useRemixForm(budgetInfoFormSchema, 'onChange')

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        if (data.name !== name || data.description !== description) {
            fetcher.submit(
                {
                    ...data,
                    budgetId,
                },
                {
                    action: '/api/bud/edit',
                    method: 'POST',
                }
            )
        }
    }

    useEffect(() => {
        if (fetcher.data && fetcher.state === 'idle') {
            setActive(false)
        }
    }, [fetcher, setActive])

    const navigate = useNavigate()
    const onDeleteClick = () => {
        setModalTitle('Confirm Deletion')
        setModalChildren(
            <DeleteForm
                deleteItemName={name}
                fetcherAction="/api/bud/delete"
                fetcherTarget={{ budgetId: budgetId }}
                onSubmitLoad={() => navigate(`/budget/`)} //  <-- doesn't matter since auto-navigates back anyway
            >
                <span>
                    Everything will be deleted, including all accounts created
                    under this budget.
                </span>
            </DeleteForm>
        )
        setActive(true)
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
                defaultValue={name}
            />
            <Input
                name="description"
                label="Description"
                textArea
                placeholder="Description"
                defaultValue={description}
            />
            <Submit
                disabled={
                    !!methods.formState.errors['name'] ||
                    fetcher.state === 'submitting'
                }
                className="w-full py-2 rounded-xl mt-3 mb-2"
            >
                Save
                {fetcher.state === 'submitting' && (
                    <Icon
                        type="spinner"
                        color="#fff"
                        className="size-6 animate-spin flex items-center justify-center"
                    />
                )}
            </Submit>
            <div className="w-full mt-4 flex flex-col gap-4">
                <Divider themed />
                <DeleteButton onClick={onDeleteClick}>
                    Delete Budget
                </DeleteButton>
            </div>
        </RemixForm>
    )
}

export default BudgetInfoForm
