import { useNavigate, useOutletContext, useParams } from '@remix-run/react'
import BudgetCategoryMenu from '~/components/budget/BudgetCategoryMenu'
import { useFindRelation } from '~/context/BudgetDataContext'
import { FullBudgetType } from '~/prisma/fullBudgetData'
import stopRevalidate from '~/utils/stopRevalidation'

export const shouldRevalidate = stopRevalidate

export default function BudgetCategoryRoute() {
    const budgetData = useOutletContext<FullBudgetType>()

    const params = useParams()
    const navigate = useNavigate()
    const budgetCategory = useFindRelation(
        'budgetCategories',
        'id',
        params.budgetCategoryId!
    )[0]

    if (budgetCategory === undefined) {
        navigate(`/budget/${budgetData.id}`)
    }

    return <BudgetCategoryMenu budgetCategory={budgetCategory} />
}
