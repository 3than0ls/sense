import { useState } from 'react'
import { SubmitHandler } from 'react-hook-form'
import { accountFormSchema, AccountFormSchemaType } from '~/zodSchemas/account'
import Input from '../form/Input'
import useRemixForm from '~/hooks/useRemixForm'
import RemixForm from '../RemixForm'
import Submit from '../form/Submit'
import Dropdown from '../Dropdown'
import { Budget } from '@prisma/client'
import { useModal } from '~/context/ModalContext'

type AccountFormProps = {
    budgets: Budget[]
}

const AccountForm = ({ budgets }: AccountFormProps) => {
    const { setActive } = useModal()

    // may have to use an onChange
    const { methods, fetcher } =
        useRemixForm<AccountFormSchemaType>(accountFormSchema)

    const dropdownItems = budgets.map((b) => {
        return {
            name: b.name,
            id: b.id,
        }
    })
    const [selectedBudget, setSelectedBudget] = useState<string | null>(null)
    const [dropdownError, setDropdownError] = useState(false)

    const onSubmit: SubmitHandler<AccountFormSchemaType> = (data) => {
        if (selectedBudget === null) {
            setDropdownError(true)
        } else {
            const out = {
                ...data,
                budgetId: selectedBudget,
            }
            fetcher.submit(out, {
                action: '/api/account/create',
                method: 'POST',
            })
            setActive(false)
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
            <Input name="name" label="Name" />
            <Input name="initialBalance" label="Initial Balance" />
            <div className="mb-4">
                <span className="text-xl ml-1">Budget</span>
                <Dropdown
                    dropdownItems={dropdownItems}
                    onChange={(d) => {
                        setSelectedBudget(d.id)
                    }}
                    onExpand={() => {
                        setDropdownError(false)
                    }}
                    errorState={dropdownError}
                />
            </div>
            <Submit className="w-full py-2 rounded-xl mt-8">
                Create Account
            </Submit>
        </RemixForm>
    )
}

export default AccountForm
