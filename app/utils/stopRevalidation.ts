import { ShouldRevalidateFunction } from '@remix-run/react'

// https://remix.run/docs/en/main/route/should-revalidate
const stopRevalidate: ShouldRevalidateFunction = ({
    formMethod,
    currentParams,
    nextParams,
    defaultShouldRevalidate,
}) => {
    if (
        formMethod === undefined &&
        currentParams.budgetId === nextParams.budgetId
    ) {
        return false
    }
    return defaultShouldRevalidate
}

export default stopRevalidate
