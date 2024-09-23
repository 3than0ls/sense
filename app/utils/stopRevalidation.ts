import { ShouldRevalidateFunction } from '@remix-run/react'

// https://remix.run/docs/en/main/route/should-revalidate
const stopRevalidate: ShouldRevalidateFunction = ({
    formMethod,
    defaultShouldRevalidate,
}) => {
    if (formMethod === undefined) {
        return false
    }
    return defaultShouldRevalidate
}

export default stopRevalidate
