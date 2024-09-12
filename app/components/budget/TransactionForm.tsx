import { Account, BudgetItem } from '@prisma/client'
import Dropdown, { mapToDropdownItem } from '../Dropdown'
import { useEffect, useState } from 'react'
import { useFetcher } from '@remix-run/react'
import { useModal } from '~/context/ModalContext'
import { FieldValues } from 'react-hook-form'
import useRemixForm from '~/hooks/useRemixForm'
import Input from '../form/Input'
import RemixForm from '../RemixForm'
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
    selectedBudgetItem?: Pick<BudgetItem, 'id' | 'name'>
    accounts?: Account[]
    budgetItems?: BudgetItem[]
    budgetId: string
    editTransaction?: FullAccountDataType['transactions'][number]
}

const TransactionForm = ({
    selectedBudgetItem,
    accounts,
    budgetItems,
    budgetId,
    editTransaction,
}: TransactionFormProps) => {
    const { setModalTitle, setModalChildren, setActive } = useModal()

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
    if (accountDropdownData.length > 0) {
        defaultDropdownAccount = accountDropdownData[0]
    }
    const itemDropdownData =
        budgetItems ?? mapToDropdownItem(itemFetcher.data as typeof budgetItems)
    let defaultDropdownItem = null
    if (selectedBudgetItem) {
        defaultDropdownItem = {
            id: selectedBudgetItem.id,
            name: selectedBudgetItem.name,
        }
    } else if (editTransaction) {
        defaultDropdownItem = {
            id: editTransaction.budgetItem.id,
            name: editTransaction.budgetItem.name,
        }
    } else if (itemDropdownData.length > 0) {
        // itemDropdownData is based off the prop budgetItems; this is the same as saying default to first given budget item
        defaultDropdownItem = itemDropdownData[0]
    }

    const [selectedAccount, setSelectedAccount] = useState(
        defaultDropdownAccount
    )
    const [selectedItem, setSelectedItem] = useState(defaultDropdownItem)

    const { fetcher, methods } = useRemixForm<
        TransactionFormSchemaType,
        typeof transacUpdateAction | typeof transacCreateAction
    >(transactionFormSchema, 'onChange')

    const [itemError, setItemError] = useState(false)
    const [accountError, setAccountError] = useState(false)

    const onSubmit = (d: TransactionFormSchemaType) => {
        if (!selectedItem || !selectedAccount) {
            setItemError(!selectedItem)
            setAccountError(!selectedAccount)
        } else {
            if (!editTransaction) {
                fetcher.submit(
                    {
                        budgetItemId: selectedItem?.id,
                        accountId: selectedAccount?.id,
                        ...d,
                    },
                    { action: '/api/transac/create', method: 'POST' }
                )
            } else {
                fetcher.submit(
                    {
                        transactionId: editTransaction.id,
                        budgetItemId: selectedItem?.id,
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

    // code only applies if editTransaction object is not undefined
    const onDelete = () => {
        if (editTransaction) {
            setModalTitle('Confirm Deletion')
            setModalChildren(
                <DeleteForm
                    deleteItemName={`${new Date(
                        editTransaction.date
                    ).toLocaleDateString()} transaction for ${
                        editTransaction.budgetItem.name
                    } of ${toCurrencyString(editTransaction.amount)}`}
                    fetcherAction="/api/transac/delete"
                    fetcherTarget={{ transactionId: editTransaction.id }}
                ></DeleteForm>
            )
            setActive(true)
        }
        // user is NOT supposed to be here
    }

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
                        ).toLocaleDateString()} transaction for ${
                            editTransaction.budgetItem.name
                        } of ${toCurrencyString(editTransaction.amount)}`}
                        fetcherAction="/api/transac/delete"
                        fetcherTarget={{ transactionId: editTransaction.id }}
                    />
                )
            }
        >
            {' '}
            <div className="w-full flex gap-4">
                <div className="w-72">
                    <span className="ml-1 text-lg">From Account:</span>
                    <Dropdown
                        dropdownItems={accountDropdownData}
                        defaultItem={
                            editTransaction
                                ? {
                                      id: editTransaction.accountId,
                                      name: editTransaction.account.name,
                                  }
                                : undefined
                        }
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
                            setSelectedItem(d)
                        }}
                        onExpand={() => setItemError(false)}
                        errorState={itemError && selectedItem === null}
                        className="w-full"
                    />
                </div>
            </div>
            <Input
                placeholder="0.00"
                label="Amount"
                name="amount"
                defaultValue={
                    editTransaction?.amount
                        ? toCurrencyString(editTransaction.amount)
                        : undefined
                }
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

    // return (
    //     <RemixForm
    //         methods={methods}
    //         fetcher={fetcher}
    //         onSubmit={onSubmit}
    //         noAction
    //         className="flex flex-col gap-4 w-full"
    //     >
    //         <div className="w-full flex gap-4">
    //             <div className="w-72">
    //                 <span className="ml-1 text-lg">From Account:</span>
    //                 <Dropdown
    //                     dropdownItems={accountDropdownData}
    //                     defaultItem={
    //                         editTransaction
    //                             ? {
    //                                   id: editTransaction.accountId,
    //                                   name: editTransaction.account.name,
    //                               }
    //                             : undefined
    //                     }
    //                     onChange={(d) => {
    //                         setSelectedAccount(d)
    //                     }}
    //                     onExpand={() => setAccountError(false)}
    //                     errorState={accountError && selectedAccount === null}
    //                     className="w-full"
    //                 />
    //             </div>
    //             <div className="w-72">
    //                 <span className="ml-1 text-lg">For Item:</span>
    //                 <Dropdown
    //                     dropdownItems={itemDropdownData}
    //                     defaultItem={defaultDropdownItem ?? undefined}
    //                     onChange={(d) => {
    //                         setSelectedItem(d)
    //                     }}
    //                     onExpand={() => setItemError(false)}
    //                     errorState={itemError && selectedItem === null}
    //                     className="w-full"
    //                 />
    //             </div>
    //         </div>
    //         <div className="flex flex-col gap-2">
    //             <Input
    //                 placeholder="0.00"
    //                 label="Amount"
    //                 name="amount"
    //                 defaultValue={
    //                     editTransaction?.amount
    //                         ? toCurrencyString(editTransaction.amount)
    //                         : undefined
    //                 }
    //             />
    //             <Input
    //                 placeholder="Optional description..."
    //                 label="Description"
    //                 name="description"
    //                 textArea
    //                 defaultValue={editTransaction?.description || undefined}
    //             />
    //         </div>
    //         <button
    //             type="submit"
    //             className={`hover:cursor-pointer enabled:hover:bg-opacity-85 disabled:hover:cursor-not-allowed disabled:opacity-50 w-full mt-2 transition bg-primary rounded-lg mr-auto px-4 py-2`}
    //         >
    //             {editTransaction ? 'Update Transaction' : 'Log Transaction'}
    //         </button>
    //         {editTransaction && (
    //             <div className="w-full mt-4 flex flex-col gap-4">
    //                 <Divider themed />
    //                 <DeleteButton noSubmit onClick={onDelete}>
    //                     Delete Transaction
    //                 </DeleteButton>
    //             </div>
    //         )}
    //     </RemixForm>
    // )
}

export default TransactionForm
