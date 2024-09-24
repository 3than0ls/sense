import { SubmitHandler } from 'react-hook-form'
import { accountFormSchema, AccountFormSchemaType } from '~/zodSchemas/account'
import Input from '../form/Input'
import useRemixForm from '~/hooks/useRemixForm'
import { Budget } from '@prisma/client'
import { useNavigate } from '@remix-run/react'
import { FullAccountType } from '~/prisma/fullAccountData'
import DeleteForm from '../DeleteForm'
import CreateUpdateModalForm from '../CreateUpdateModalForm'
import { action as accountUpdateAction } from '~/routes/api.account.update'
import { action as accountCreateAction } from '~/routes/api.account.create'
import { useTheme } from '~/context/ThemeContext'

type AccountFormProps = {
    budgetData: Pick<Budget, 'id' | 'name'>
    editAccount?: FullAccountType
}

const AccountForm = ({ budgetData, editAccount }: AccountFormProps) => {
    // may have to use an onChange
    const { methods, fetcher } = useRemixForm<
        AccountFormSchemaType,
        typeof accountUpdateAction | typeof accountCreateAction
    >(accountFormSchema, 'onChange')

    const onSubmit: SubmitHandler<AccountFormSchemaType> = (data) => {
        const submitTarget = new FormData()
        for (const [key, value] of Object.entries(data)) {
            submitTarget.append(key, value.toString())
        }
        submitTarget.append('budgetId', editAccount?.budgetId ?? budgetData.id)
        if (editAccount) {
            submitTarget.append('accountId', editAccount.id)
        }
        fetcher.submit(submitTarget, {
            action: editAccount ? '/api/account/update' : '/api/account/create',
            method: 'POST',
        })
    }

    const navigate = useNavigate()

    const { theme } = useTheme()
    const themeStyles =
        theme === 'DARK' ? 'text-light bg-light' : 'text-light bg-white'

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
            {/* <div className="4">
                <span className="text-xl ml-1">
                    For budget {budgetData.name}
                </span>
            </div> */}
            <div className="mb-4 flex-col">
                <span className="ml-1 text-xl">For Budget</span>
                <div
                    className={`${themeStyles} select-none brightness-75 hover:cursor-not-allowed w-full rounded-lg p-2 transition-all duration-100 outline-none`}
                >
                    {budgetData.name}
                </div>
            </div>
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
                defaultValue={editAccount?.initialBalance.toFixed(2)}
                isMoney
            />
        </CreateUpdateModalForm>
    )
}

export default AccountForm
