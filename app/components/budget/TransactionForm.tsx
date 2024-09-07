import { Account, BudgetItem } from '@prisma/client'
import Dropdown from '../Dropdown'
import { useEffect, useState } from 'react'
import { useFetcher } from '@remix-run/react'
import { useModal } from '~/context/ModalContext'
import { FieldValues } from 'react-hook-form'
import useRemixForm from '~/hooks/useRemixForm'
import Input from '../form/Input'
import RemixForm from '../RemixForm'
import { transactionFormSchema } from '~/zodSchemas/transaction'

type TransactionFormProps = {
    selectedBudgetItem?: BudgetItem
    accounts?: Account[]
    budgetItems?: BudgetItem[]
    budgetId: string
}

const TransactionForm = ({
    selectedBudgetItem,
    accounts,
    budgetItems,
    budgetId,
}: TransactionFormProps) => {
    // modal state manager
    const { setActive } = useModal()

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

    const accountDropdownData =
        (accounts ?? (accountFetcher.data as typeof accounts))?.map((a) => {
            return {
                id: a.id,
                name: a.name,
            }
        }) ?? []

    const itemDropdownData =
        (budgetItems ?? (itemFetcher.data as typeof budgetItems))?.map((b) => {
            return {
                id: b.id,
                name: b.name,
            }
        }) ?? []

    const [selectedAccount, setSelectedAccount] = useState(
        accountDropdownData.length === 0 ? null : accountDropdownData[0]
    )
    const [selectedItem, setSelectedItem] = useState(
        selectedBudgetItem
            ? {
                  id: selectedBudgetItem.id,
                  name: selectedBudgetItem.name,
              }
            : itemDropdownData.length === 0
            ? null
            : itemDropdownData[0]
    )

    const { fetcher, methods } = useRemixForm(transactionFormSchema, 'onChange')

    const [itemError, setItemError] = useState(false)
    const [accountError, setAccountError] = useState(false)

    const onSubmit = (d: FieldValues) => {
        if (!selectedItem || !selectedAccount) {
            setItemError(!selectedItem)
            setAccountError(!selectedAccount)
        } else {
            fetcher.submit(
                {
                    budgetItemId: selectedItem?.id,
                    accountId: selectedAccount?.id,
                    ...d,
                },
                { action: '/api/transac/create', method: 'POST' }
            )
        }
    }

    useEffect(() => {
        console.log(fetcher.state)
        // assumes fetcher data is a valid response (which SHOULD be the transaction object) and not some error code or other... hopefully.
        if (fetcher.data && fetcher.state === 'idle') {
            setActive(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetcher.data, fetcher.state])

    return (
        <RemixForm
            methods={methods}
            fetcher={fetcher}
            onSubmit={onSubmit}
            noAction
            className="flex flex-col gap-4 w-full"
        >
            <div className="w-full flex gap-4">
                <div className="w-72">
                    <span className="ml-1 text-lg">From Account:</span>
                    <Dropdown
                        dropdownItems={accountDropdownData}
                        defaultItem={accountDropdownData[0]}
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
                        defaultItem={itemDropdownData[0]}
                        onChange={(d) => {
                            setSelectedItem(d)
                        }}
                        onExpand={() => setItemError(false)}
                        errorState={itemError && selectedItem === null}
                        className="w-full"
                    />
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <Input placeholder="0.00" label="Amount" name="amount" />
                <Input
                    placeholder="Optional description..."
                    label="Description"
                    name="description"
                    textArea
                />
            </div>
            <button
                type="submit"
                className={`hover:cursor-pointer enabled:hover:bg-opacity-85 disabled:hover:cursor-not-allowed disabled:opacity-50 w-full mt-2 transition bg-primary rounded-lg mr-auto px-4 py-2`}
            >
                Log Transaction
            </button>
            {fetcher.state === 'loading' && 'TEMP TEMPORARY LOADING STATE!!!!'}
        </RemixForm>
    )
}

export default TransactionForm
