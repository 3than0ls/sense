import { useNavigate, useOutletContext, useParams } from '@remix-run/react'
import { useEffect } from 'react'
import BudgetItemMenu from '~/components/budget/BudgetItemMenu'
import { useFindRelation } from '~/context/BudgetDataContext'
import { FullBudgetType } from '~/prisma/fullBudgetData'
import stopRevalidate from '~/utils/stopRevalidation'

export const shouldRevalidate = stopRevalidate

export default function BudgetItemRoute() {
    const budgetData = useOutletContext<FullBudgetType>()

    const params = useParams()

    const navigate = useNavigate()
    const budgetItem = useFindRelation(
        'budgetItems',
        'id',
        params.budgetItemId!
    )[0]

    useEffect(() => {
        if (budgetItem === undefined) {
            navigate(`/budget/${budgetData.id}`)
        }
    }, [budgetItem, navigate, budgetData])

    return budgetItem === undefined ? (
        <></>
    ) : (
        <BudgetItemMenu budgetItem={budgetItem} />
    )
}
