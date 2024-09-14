import React from 'react'
import { FullAccountDataType } from '~/prisma/fullAccountData'
import CreateUpdateModalForm from '../CreateUpdateModalForm'
import { Transaction } from '@prisma/client'
import useRemixForm from '~/hooks/useRemixForm'
import { z } from 'zod'
import numberSchema from '~/zodSchemas/number'
import { action as transacCreateAction } from '~/routes/api.transac.create'
import { action as transacUpdateAction } from '~/routes/api.transac.update'
import Input from '../form/Input'
import { SubmitHandler } from 'react-hook-form'
import Information from '../Information'
import toCurrencyString from '~/utils/toCurrencyString'
import Divider from '../Divider'

// a reconciliation is just a special type of Transaction on the frontend; essentially just a transaction on the backend

const reconciliationSchema = z.object({
    realAccountBalance: numberSchema,
    description: z
        .string()
        .max(500, 'Reconciliation description too long.')
        .optional(),
})
type ReconciliationSchemaType = z.infer<typeof reconciliationSchema>

type ReconcileFormProps = {
    accountData: FullAccountDataType
    accountBalance: number
    // editReconciliation: Transaction
}

const ReconcileForm = ({
    accountData,
    accountBalance,
}: // editReconciliation,
ReconcileFormProps) => {
    const { methods, fetcher } = useRemixForm<
        ReconciliationSchemaType,
        typeof transacUpdateAction | typeof transacCreateAction
    >(reconciliationSchema, 'onChange')

    const realAccountBalanceState = methods.watch('realAccountBalance')
    const reconciliationAmount = realAccountBalanceState - accountBalance

    const onSubmit: SubmitHandler<ReconciliationSchemaType> = (data) => {
        const difference = data.realAccountBalance - accountBalance

        fetcher.submit(
            {
                budgetItemId: '',
                accountId: accountData.id,
                transactionFlow: difference < 0 ? 'outflow' : 'inflow',
                amount: Math.abs(difference),
                description: data.description
                    ? 'Reconciliation: '.concat(data.description)
                    : 'Account Reconciliation',
            },
            {
                action: '/api/transac/create',
                method: 'POST',
            }
        )
    }

    return (
        <CreateUpdateModalForm
            className="w-[500px]"
            name="Reconciliation"
            onSubmit={onSubmit}
            methods={methods}
            fetcher={fetcher}
            type={'create'}
            disable={reconciliationAmount === 0}
        >
            <div className="p-2 w-full flex flex-col gap-1 text-base">
                <span className="indent-8">
                    Reconciling occurs when you find that you have discrepancies
                    between actual and expected results and need to fix them.
                    Reconcile your account if your actual account balance
                    differs from the balance shown here.
                </span>
                <span className="indent-8">
                    Reconciliations will affect only your free cash, and will
                    not draw money from items already assigned cash.
                </span>
                <span className="indent-8">
                    However, if you reconcile to an amount lower than your total
                    cash assigned to items, you may need to adjust.
                </span>
            </div>
            <Divider className="my-2" />
            <span className="ml-1 text-xl mb-4">
                Expected Account Balance: {toCurrencyString(accountBalance)}
            </span>
            <Input
                name="realAccountBalance"
                placeholder="0.00"
                isMoney
                label="Actual account balance"
            />
            <Input
                name="description"
                placeholder="Optional description..."
                textArea
                label="Description"
            />
            {realAccountBalanceState && (
                <span className="w-full text-xl mb-4 text-center truncate">
                    Reconciliation amount:{' '}
                    {isNaN(realAccountBalanceState) ? (
                        '...'
                    ) : (
                        <span
                            className={`${
                                reconciliationAmount < 0 && 'text-bad'
                            } ${reconciliationAmount > 0 && 'text-good'}`}
                        >
                            {toCurrencyString(
                                reconciliationAmount,
                                reconciliationAmount !== 0
                            )}
                        </span>
                    )}
                </span>
            )}
        </CreateUpdateModalForm>
    )
}

export default ReconcileForm
