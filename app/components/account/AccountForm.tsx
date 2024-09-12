import { useEffect, useState } from 'react'
import { SubmitHandler } from 'react-hook-form'
import { accountFormSchema, AccountFormSchemaType } from '~/zodSchemas/account'
import Input from '../form/Input'
import useRemixForm from '~/hooks/useRemixForm'
import RemixForm from '../RemixForm'
import Submit from '../form/Submit'
import Dropdown, { mapToDropdownItem } from '../Dropdown'
import { Budget } from '@prisma/client'
import { useModal } from '~/context/ModalContext'
import { useNavigate } from '@remix-run/react'
import { FullAccountDataType } from '~/prisma/fullAccountData'
import DeleteButton from '../DeleteButton'
import Divider from '../Divider'
import DeleteForm from '../DeleteForm'
import toCurrencyString from '~/utils/toCurrencyString'
import CreateUpdateModalForm from '../CreateUpdateModalForm'
import { action as accountUpdateAction } from '~/routes/api.account.update'
import { action as accountCreateAction } from '~/routes/api.account.create'

type AccountFormProps = {
    budgets: Pick<Budget, 'id' | 'name'>[]
    editAccount?: FullAccountDataType
}

const AccountForm = ({ budgets, editAccount }: AccountFormProps) => {
    const { setActive, setModalChildren, setModalTitle } = useModal()

    // may have to use an onChange
    const { methods, fetcher } = useRemixForm<
        AccountFormSchemaType,
        typeof accountUpdateAction | typeof accountCreateAction
    >(accountFormSchema, 'onChange')

    const dropdownItems = mapToDropdownItem(budgets)

    const [dropdownError, setDropdownError] = useState(false)

    const [selectedBudget, setSelectedBudget] = useState<string | null>(
        editAccount?.budgetId ?? null
    )

    const onSubmit: SubmitHandler<AccountFormSchemaType> = (data) => {
        if (selectedBudget !== null) {
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
        } else {
            setDropdownError(true)
        }
    }

    const navigate = useNavigate()

    return (
        <CreateUpdateModalForm
            methods={methods}
            fetcher={fetcher}
            onSubmit={onSubmit}
            name="Account"
            type={editAccount ? 'update' : 'create'}
            deleteForm={
                editAccount && (
                    <DeleteForm
                        deleteItemName={editAccount.name}
                        fetcherAction="/api/account/delete"
                        fetcherTarget={{ accountId: editAccount.id }}
                        onSubmitLoad={() =>
                            navigate(`/budget/${editAccount.budgetId}`)
                        }
                    >
                        <span>
                            All transactions associated with this account will
                            also be deleted.
                        </span>
                    </DeleteForm>
                )
            }
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
                    editAccount?.initialBalance
                        ? toCurrencyString(editAccount.initialBalance)
                        : undefined
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
        </CreateUpdateModalForm>
        // <RemixForm
        //     className="min-w-96 flex flex-col gap-2"
        //     methods={methods}
        //     fetcher={fetcher}
        //     onSubmit={onSubmit}
        //     noAction={true}
        // >
        //     <Input
        //         name="name"
        //         label="Name"
        //         placeholder="Account Name"
        //         defaultValue={editAccount?.name ?? undefined}
        //     />
        //     <Input
        //         name="initialBalance"
        //         label="Initial Balance"
        //         placeholder="0.00"
        //         defaultValue={
        //             editAccount?.initialBalance
        //                 ? toCurrencyString(editAccount.initialBalance)
        //                 : undefined
        //         }
        //     />
        //     <div className="mb-4">
        //         <span className="text-xl ml-1">Budget</span>
        //         <Dropdown
        //             disabled={!!editAccount}
        //             dropdownItems={dropdownItems}
        //             defaultItem={
        //                 editAccount
        //                     ? {
        //                           id: editAccount.budgetId,
        //                           name: editAccount.budget.name,
        //                       }
        //                     : undefined
        //             }
        //             onChange={(d) => {
        //                 setSelectedBudget(d.id)
        //             }}
        //             onExpand={() => {
        //                 setDropdownError(false)
        //             }}
        //             errorState={dropdownError}
        //         />
        //     </div>
        //     <Submit className="w-full py-2 rounded-xl mt-4">
        //         {editAccount ? 'Update Account' : 'Create Account'}
        //     </Submit>
        //     {editAccount && (
        //         <div className="w-full mt-4 flex flex-col gap-4">
        //             <Divider themed />
        //             <DeleteButton noSubmit onClick={onDeleteClick}>
        //                 Delete Account
        //             </DeleteButton>
        //         </div>
        //     )}
        // </RemixForm>
    )
}

export default AccountForm
