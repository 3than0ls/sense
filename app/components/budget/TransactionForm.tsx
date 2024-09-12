import { Account, BudgetItem } from '@prisma/client'
import Dropdown, { mapToDropdownItem } from '../Dropdown'
import { useEffect, useState } from 'react'
import { useFetcher } from '@remix-run/react'
import { useModal } from '~/context/ModalContext'
import useRemixForm from '~/hooks/useRemixForm'
import Input from '../form/Input'
import {
    transactionFormSchema,
    TransactionFormSchemaType,
} from '~/zodSchemas/transaction'
import { FullAccountDataType } from '~/prisma/fullAccountData'
import DeleteForm from '../DeleteForm'
import toCurrencyString from '~/utils/toCurrencyString'
import CreateUpdateModalForm from '../CreateUpdateModalForm'
import { action as transacUpdateAction } from '~/routes/api.transac.update'
import { action as transacCreateAction } from '~/routes/api.transac.create'

type TransactionFormProps = {
    defaultAccount?: Pick<Account, 'id' | 'name'>
    defaultBudgetItem?: Pick<BudgetItem, 'id' | 'name'>
    accounts?: Account[]
    budgetItems?: BudgetItem[]
    budgetId: string
    editTransaction?: FullAccountDataType['transactions'][number]
}

const TransactionForm = ({
    defaultAccount,
    defaultBudgetItem,
    accounts,
    budgetItems,
    budgetId,
    editTransaction,
}: TransactionFormProps) => {
    const { setActive } = useModal()

    // fetch data if not provided
    const accountFetcher = useFetcher()
    const itemFetcher = useFetcher()
    useEffect(() => {
        if (!accounts) {
            accountFetcher.load(`/api/bud/accounts/${budgetId}`)
        }
        if (!budgetItems) {
            itemFetcher.load(`/api/bud/items/${budgetId}`)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accounts, budgetItems])

    // hoops and hurdle to establish dropdown data and defaults
    // fetcher.data forces component rerender, meaning accountDropdownData is updated
    // but variables based off this do not update too.
    // problem: can't use accountDropdownData[0] as default value, because
    // it still thinks accountDropdownData (based on accountFetcher.data) is empty {}
    const accountDropdownData =
        accounts ?? mapToDropdownItem(accountFetcher.data as typeof accounts)
    let defaultDropdownAccount = null // TODO; this, for adding transaction from a account page
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

    const itemDropdownData = [
        { id: '', name: 'Free Cash' },
        ...(budgetItems ??
            mapToDropdownItem(itemFetcher.data as typeof budgetItems)),
    ]
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
                        budgetItemId: selectedBudgetItem?.id,
                        accountId: selectedAccount?.id,
                        ...d,
                    },
                    { action: '/api/transac/create', method: 'POST' }
                )
            } else {
                fetcher.submit(
                    {
                        transactionId: editTransaction.id,
                        budgetItemId: selectedBudgetItem?.id,
                        accountId: selectedAccount?.id,
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
        >
            <div className="w-full flex gap-4">
                <div className="w-72">
                    <span className="ml-1 text-lg">From Account:</span>
                    <Dropdown
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
            <Input
                placeholder="0.00"
                label="Amount"
                name="amount"
                defaultValue={editTransaction?.amount.toFixed(2)}
                isMoney
            />
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
