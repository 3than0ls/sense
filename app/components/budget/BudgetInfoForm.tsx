import { FieldValues, SubmitHandler } from 'react-hook-form'
import Input from '../form/Input'
import useRemixForm from '~/hooks/useRemixForm'
import RemixForm from '../RemixForm'
import Submit from '../form/Submit'
import { useModal } from '~/context/ModalContext'
import { budgetInfoFormSchema } from '~/zodSchemas/budgetInfo'

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
    const { setActive } = useModal()

    // may have to use an onChange
    const { methods, fetcher } = useRemixForm(budgetInfoFormSchema)

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
            setActive(false)
        }
    }

    // useEffect onSubmit setActive

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
            <Submit className="w-full py-2 rounded-xl mt-8">Save</Submit>
        </RemixForm>
    )
}

export default BudgetInfoForm
