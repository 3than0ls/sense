import { useEffect, useState } from 'react'
import { SubmitHandler } from 'react-hook-form'
import { accountFormSchema, AccountFormSchemaType } from '~/zodSchemas/account'
import Input from '../form/Input'
import useRemixForm from '~/hooks/useRemixForm'
import RemixForm from '../RemixForm'
import Submit from '../form/Submit'
import Dropdown from '../Dropdown'
import { Budget } from '@prisma/client'
import { useModal } from '~/context/ModalContext'
import { useNavigate, useRevalidator } from '@remix-run/react'
import { FullAccountDataType } from '~/prisma/fullAccountData'
import DeleteButton from '../DeleteButton'
import Divider from '../Divider'
import DeleteForm from '../DeleteForm'

type AccountFormProps = {
    budgets: Pick<Budget, 'id' | 'name'>[]
    editAccount?: FullAccountDataType
}

const AccountForm = ({ budgets, editAccount }: AccountFormProps) => {
    const { setActive, setModalChildren, setModalTitle } = useModal()

    // may have to use an onChange
    const { methods, fetcher } =
        useRemixForm<AccountFormSchemaType>(accountFormSchema)

    const dropdownItems = budgets.map((b) => {
        return {
            name: b.name,
            id: b.id,
        }
    })

    const [selectedBudget, setSelectedBudget] = useState<string | null>(
        editAccount?.budgetId ?? null
    )
    const [dropdownError, setDropdownError] = useState(false)

    const validator = useRevalidator()

    const onSubmit: SubmitHandler<AccountFormSchemaType> = (data) => {
        if (selectedBudget === null) {
            setDropdownError(true)
        } else {
            const submitTarget = new FormData()
            for (const [key, value] of Object.entries(data)) {
                submitTarget.append(key, value.toString())
            }
            submitTarget.append(
                'budgetId',
                editAccount?.budgetId ?? selectedBudget
            )
            if (editAccount) {
                submitTarget.append('accountId', editAccount.id)
            }

            fetcher.submit(submitTarget, {
                action: editAccount
                    ? '/api/account/update'
                    : '/api/account/create',
                method: 'POST',
            })
            validator.revalidate()
            setActive(false)
        }
    }

    const navigate = useNavigate()
    const onDeleteClick = () => {
        if (editAccount) {
            setModalTitle('Confirm Deletion')
            setModalChildren(
                <DeleteForm
                    deleteItemName={editAccount.name}
                    fetcherAction="/api/account/delete"
                    fetcherTarget={{ accountId: editAccount.id }}
                    onSubmit={() => navigate(`/budget/${editAccount.budgetId}`)}
                >
                    <span>
                        All transactions associated with this account will also
                        be deleted.
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
                placeholder="Account Name"
                defaultValue={editAccount?.name ?? undefined}
            />
            <Input
                name="initialBalance"
                label="Initial Balance"
                placeholder="0.00"
                defaultValue={
                    editAccount?.initialBalance.toFixed(2) ?? undefined
                }
            />
            <div className="mb-4">
                <span className="text-xl ml-1">Budget</span>
                <Dropdown
                    disabled={!!editAccount}
                    dropdownItems={dropdownItems}
                    defaultItem={
                        editAccount
                            ? {
                                  id: editAccount.budgetId,
                                  name: editAccount.budget.name,
                              }
                            : undefined
                    }
                    onChange={(d) => {
                        setSelectedBudget(d.id)
                    }}
                    onExpand={() => {
                        setDropdownError(false)
                    }}
                    errorState={dropdownError}
                />
            </div>
            <Submit className="w-full py-2 rounded-xl mt-4">
                {editAccount ? 'Update Account' : 'Create Account'}
            </Submit>
            {editAccount && (
                <div className="w-full mt-4 flex flex-col gap-4">
                    <Divider themed />
                    <DeleteButton onClick={onDeleteClick}>
                        Delete Account
                    </DeleteButton>
                </div>
            )}
        </RemixForm>
    )
}

export default AccountForm
