import { Account, BudgetItem } from '@prisma/client'
import Dropdown from '../Dropdown'
import { useEffect, useState } from 'react'
import { useModal } from '~/context/ModalContext'
import useRemixForm from '~/hooks/useRemixForm'
import Input from '../form/Input'
import {
    transactionFormSchema,
    TransactionFormSchemaType,
} from '~/zodSchemas/transaction'
import DeleteForm from '../DeleteForm'
import toCurrencyString from '~/utils/toCurrencyString'
import CreateUpdateModalForm from '../CreateUpdateModalForm'
import { action as transacUpdateAction } from '~/routes/api.transac.update'
import { action as transacCreateAction } from '~/routes/api.transac.create'
import TransactionFormFlowButton from './TransactionFormFlowButton'
import { BasicBudgetType, FullAccountType } from '~/prisma/fullAccountData'

type TransactionFormProps = {
    defaultAccount?: Pick<Account, 'id' | 'name'>
    defaultBudgetItem?: Pick<BudgetItem, 'id' | 'name'>
    basicBudgetData: BasicBudgetType
    editTransaction?: FullAccountType['transactions'][number] & {
        account: {
            name: string
        }
    }
}

const TransactionForm = ({
    defaultAccount,
    defaultBudgetItem,
    editTransaction,
    basicBudgetData,
}: TransactionFormProps) => {
    const { setActive } = useModal()

    const { accounts, budgetItems } = basicBudgetData

    // hoops and hurdle to establish dropdown data and defaults
    // fetcher.data forces component rerender, meaning accountDropdownData is updated
    // but variables based off this do not update too.
    // problem: can't use accountDropdownData[0] as default value, because
    // it still thinks accountDropdownData (based on accountFetcher.data) is empty {}

    // account related
    const accountDropdownData = accounts
    let defaultDropdownAccount = null
    if (defaultAccount) {
        defaultDropdownAccount = {
            id: defaultAccount.id,
            name: defaultAccount.name,
        }
    } else if (editTransaction) {
        defaultDropdownAccount = {
            id: editTransaction.accountId,
            name: editTransaction.account.name,
        }
    }
    const [selectedAccount, setSelectedAccount] = useState(
        defaultDropdownAccount
    )

    // budget item related
    const itemDropdownData = [{ id: '', name: 'Free Cash' }, ...budgetItems]
    let defaultDropdownItem = null
    if (defaultBudgetItem) {
        defaultDropdownItem = {
            id: defaultBudgetItem.id,
            name: defaultBudgetItem.name,
        }
    } else if (editTransaction) {
        defaultDropdownItem = {
            id: editTransaction.budgetItem?.id ?? '',
            name: editTransaction.budgetItem?.name ?? 'Free Cash',
        }
    }
    const [selectedBudgetItem, setSelectedBudgetItem] =
        useState(defaultDropdownItem)

    // flow related
    const defaultFlow = editTransaction
        ? editTransaction.amount < 0
            ? 'outflow'
            : 'inflow'
        : 'outflow'
    const [transacFlow, setTransacFlow] = useState<'inflow' | 'outflow'>(
        defaultFlow
    )
    const onSwitch = (side: 'inflow' | 'outflow') => {
        setTransacFlow(side)
    }

    const { fetcher, methods } = useRemixForm<
        TransactionFormSchemaType,
        typeof transacUpdateAction | typeof transacCreateAction
    >(transactionFormSchema, 'onChange')

    const [itemError, setItemError] = useState(false)
    const [accountError, setAccountError] = useState(false)

    const onSubmit = (d: TransactionFormSchemaType) => {
        if (!selectedBudgetItem || !selectedAccount) {
            setItemError(!selectedBudgetItem)
            setAccountError(!selectedAccount)
        } else {
            if (!editTransaction) {
                fetcher.submit(
                    {
                        budgetId: basicBudgetData.id,
                        budgetItemId: selectedBudgetItem?.id,
                        accountId: selectedAccount?.id,
                        transactionFlow: transacFlow,
                        ...d,
                    },
                    { action: '/api/transac/create', method: 'POST' }
                )
            } else {
                fetcher.submit(
                    {
                        transactionId: editTransaction.id,
                        budgetId: editTransaction.budgetId,
                        budgetItemId: selectedBudgetItem?.id,
                        accountId: selectedAccount?.id,
                        transactionFlow: transacFlow,
                        ...d,
                    },
                    { action: '/api/transac/update', method: 'POST' }
                )
            }
        }
    }

    useEffect(() => {
        // assumes fetcher data is a valid response (which SHOULD be the transaction object) and not some error code or other... hopefully.
        if (fetcher.data && fetcher.state === 'idle') {
            setActive(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetcher.data, fetcher.state])

    return (
        <CreateUpdateModalForm
            methods={methods}
            fetcher={fetcher}
            onSubmit={onSubmit}
            name="Transaction"
            type={editTransaction ? 'update' : 'create'}
            disable={!!methods.formState.errors['amount']}
            deleteForm={
                editTransaction && (
                    <DeleteForm
                        deleteItemName={`${new Date(
                            editTransaction.date
                        ).toLocaleDateString()} transaction ${
                            editTransaction.budgetItem === null
                                ? 'for Free Cash'
                                : `for ${editTransaction.budgetItem.name}`
                        } of ${toCurrencyString(editTransaction.amount)}`}
                        fetcherAction="/api/transac/delete"
                        fetcherTarget={{ transactionId: editTransaction.id }}
                    />
                )
            }
            submitButtonText={
                editTransaction ? 'Update Transaction' : 'Log Transaction'
            }
        >
            <div className="w-full flex gap-4">
                <div className="w-72">
                    <span className="ml-1 text-lg">From Account:</span>
                    <Dropdown
                        // key={selectedAccount?.id ?? 'smt'}  <- why did I even have this
                        dropdownItems={accountDropdownData}
                        defaultItem={defaultDropdownAccount ?? undefined}
                        onChange={(d) => {
                            setSelectedAccount(d)
                        }}
                        onExpand={() => setAccountError(false)}
                        errorState={accountError && selectedAccount === null}
                        className="w-full"
                    />
                </div>
                <div className="w-72">
                    <span className="ml-1 text-lg">For Item:</span>
                    <Dropdown
                        dropdownItems={itemDropdownData}
                        defaultItem={defaultDropdownItem ?? undefined}
                        onChange={(d) => {
                            setSelectedBudgetItem(d)
                        }}
                        onExpand={() => setItemError(false)}
                        errorState={itemError && selectedBudgetItem === null}
                        className="w-full"
                    />
                </div>
            </div>
            <div className="w-full flex items-center gap-2">
                <Input
                    placeholder="0.00"
                    label="Amount"
                    name="amount"
                    defaultValue={
                        editTransaction
                            ? Math.abs(editTransaction.amount).toFixed(2)
                            : undefined
                    }
                    isMoney
                />
                <TransactionFormFlowButton
                    className="mt-2.5"
                    onSwitch={onSwitch}
                    defaultSide={defaultFlow}
                />
            </div>
            <Input
                placeholder="Optional description..."
                label="Description"
                name="description"
                textArea
                defaultValue={editTransaction?.description || undefined}
            />
        </CreateUpdateModalForm>
    )
}

export default TransactionForm
