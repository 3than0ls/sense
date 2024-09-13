import { BudgetItem } from '@prisma/client'
import Dropdown from '../Dropdown'
import { useEffect, useState } from 'react'
import { useFetcher } from '@remix-run/react'
import { action } from '~/routes/api.assign.create'
import { useModal } from '~/context/ModalContext'
import { loader } from '~/routes/api.bud.items.$budgetId'
import CreateUpdateModalForm from '../CreateUpdateModalForm'
import {
    AssignmentFormSchemaType,
    assignmentFormSchema,
} from '~/zodSchemas/assignment'
import useRemixForm from '~/hooks/useRemixForm'
import Input from '../form/Input'
import { SubmitHandler } from 'react-hook-form'

type AssignmentFormProps = {
    targetBudgetItem: Pick<BudgetItem, 'id' | 'target' | 'budgetId'>
    targetBudgetItemAssigned: number
}

const AssignmentForm = ({
    targetBudgetItem,
    targetBudgetItemAssigned,
}: AssignmentFormProps) => {
    // dropdown item setting and fetching
    const [dropdownItems, setDropdownItems] = useState([
        {
            name: 'Free Cash',
            id: 'Free Cash',
        },
    ])
    const budgetItemFetcher = useFetcher<typeof loader>()
    useEffect(() => {
        if (!budgetItemFetcher.data) {
            budgetItemFetcher.load(
                `/api/bud/items/${targetBudgetItem.budgetId}`
            )
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(() => {
        if (budgetItemFetcher.data && budgetItemFetcher.data.length > 0) {
            setDropdownItems([
                {
                    name: 'Free Cash',
                    id: 'Free Cash',
                },
                ...budgetItemFetcher.data
                    .filter((bItem) => bItem.id !== targetBudgetItem.id)
                    .map((bItem) => {
                        return {
                            name: bItem.name,
                            id: bItem.id,
                        }
                    }),
            ])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [budgetItemFetcher.data])

    const { setActive } = useModal()

    // dropdown and input states
    const [from, setFrom] = useState(dropdownItems[0])

    const { methods, fetcher } = useRemixForm<
        AssignmentFormSchemaType,
        typeof action
    >(assignmentFormSchema, 'onChange')

    const onSubmit: SubmitHandler<AssignmentFormSchemaType> = (d) => {
        const fromFreeCash = from.name === 'Free Cash'
        fetcher.submit(
            {
                toBudgetItemId: targetBudgetItem.id,
                fromFreeCash,
                fromBudgetItemId: fromFreeCash ? '' : from.id,
                amount: d.amount,
            },
            { action: '/api/assign/create', method: 'POST' }
        )
    }

    // server error catcher
    useEffect(() => {
        if (fetcher.data) {
            if (fetcher.data.success) {
                setActive(false)
            } else {
                methods.setError('amount', { message: fetcher.data.reason })
            }
        }
    }, [fetcher.data, fetcher.state, setActive, methods])

    return (
        <CreateUpdateModalForm
            methods={methods}
            fetcher={fetcher}
            name="Assignment"
            onSubmit={onSubmit}
            disable={undefined}
            type="create"
            onFetcherLoading={() => {
                /* I don't want it to do anything */
            }}
            submitButtonText="Assign money"
        >
            <div>
                <span>From:</span>
                <Dropdown
                    dropdownItems={dropdownItems}
                    defaultItem={dropdownItems[0]}
                    onChange={(d) => {
                        setFrom(d)
                    }}
                    className="w-full"
                />
            </div>
            <div className="flex flex-col">
                <div className="flex gap-2 items-center">
                    <Input
                        name="amount"
                        placeholder="0.00"
                        label="Amount"
                        className="flex-grow min-w-96"
                        isMoney
                    />
                    <button
                        onClick={() => {
                            const leftover =
                                targetBudgetItem.target -
                                targetBudgetItemAssigned

                            // look; I know that it has an error, but zod or react-hook-form are having some discrepancy error
                            // amount is of numberSchema, which transform string to number
                            // if you were to set it as a number, however, further validation would error and show error message
                            // because numberSchema starts off as a string
                            // however you only get a type error here, which doesn't render on UI in any form
                            methods.setValue('amount', leftover.toFixed(2))
                            methods.clearErrors()
                        }}
                        type="button"
                        className="w-fit bg-primary mt-[6px] rounded-lg px-3 text-sm text-nowrap hover:bg-opacity-85 transition h-[40px]"
                    >
                        Reach Target
                    </button>
                </div>
                {/* {error && <span className="text-error">{error}</span>} */}
            </div>
        </CreateUpdateModalForm>
    )
}

export default AssignmentForm
