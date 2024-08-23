import { LoaderFunctionArgs } from '@remix-run/node'
import {
    Link,
    Outlet,
    useFetcher,
    useLoaderData,
    useMatches,
    useNavigate,
} from '@remix-run/react'
import { useEffect } from 'react'
import BudgetMenuForm from '~/components/budget/BudgetMenuForm'
import Icon from '~/components/icons/Icon'
import { useTheme } from '~/context/ThemeContext'
import fakeData from '~/utils/fakeData'
import categoryNameSchema from '~/zodSchemas/budgetCategory'

export async function loader({ params }: LoaderFunctionArgs) {
    console.log('LOADING BUDGET CATEGORY ID', params.budgetCategoryId)

    // split between just using outlet context to cut out another fetching step,
    // but will likely do a refetch so revalidating is easy

    // fetch budget from database using budgetId
    // get user from supabase auth getUser
    // ensure userId from budget and user.id from supabase auth match
    // if not, redirect to home
    // if yes, return budget data

    // in the meantime, here's some fake data
    const data = fakeData()

    const budgetCategory = data.budgetCategories.find(
        (budgetCategory) => budgetCategory.id === params.budgetCategoryId
    )!

    // THROW ERROR IF BUDGETCATEGORY SOMEHOW NOT FOUND (someone manually type invalid request/params) and return error to client

    return { data, budgetCategory }
}

export default function BudgetCategoryEditRoute() {
    const { budgetCategory } = useLoaderData<typeof loader>()

    const { theme } = useTheme()
    const themeStyle = theme === 'DARK' ? 'bg-black' : 'bg-white'
    const altThemeStyle = theme === 'DARK' ? 'bg-dark' : 'bg-light'

    const fetcher = useFetcher()
    const navigate = useNavigate()

    const budgetItems = Array.from(budgetCategory.budgetItems, (budgetItem) => {
        return (
            <Link
                to={budgetItem.id}
                key={budgetItem.id}
                className={`${altThemeStyle} rounded-xl hover:bg-opacity-80 transition px-4 py-2 flex justify-between items-center`}
            >
                {budgetItem.name}
                <Icon type="edit" className="size-5 stroke-subtle" />
            </Link>
        )
    })

    const createNewBudgetItem: React.FormEventHandler<HTMLFormElement> = async (
        e
    ) => {
        e.preventDefault()
        fetcher.submit(
            {
                budgetCategoryId: budgetCategory.id,
            },
            { action: '/api/budCat/newItem', method: 'POST' }
        )
    }

    useEffect(() => {
        if (fetcher.data) {
            const budgetItem = fetcher.data
            console.log('NAVIGATE TO BUDGET ITEM', budgetItem)
            // navigate(budgetItem.id)
        }
    }, [fetcher.data])

    // if further route matching, only render that
    const matches = useMatches()
    const hasFurtherRoute = matches.some(
        (match) =>
            match.id ===
            'routes/budget.$budgetId.$budgetCategoryId.$budgetItemId'
    )
    if (hasFurtherRoute) {
        return <Outlet />
    }

    // ideally should be moved to it's own component
    return (
        <div
            className={`flex flex-col gap-4 size-full p-4 text-sm ${themeStyle} rounded-xl w-full h-full`}
        >
            <div className="flex flex-col w-full justify-center items-center">
                <BudgetMenuForm
                    key={budgetCategory.name}
                    defaultValue={budgetCategory.name}
                    label="Name"
                    name="name"
                    schema={categoryNameSchema}
                    action="/api/budCat/rename"
                />
            </div>
            <hr className={`h-[1px] border-none ${altThemeStyle} bg-subtle`} />
            <div className="w-full flex flex-col gap-1">
                <span className="text-lg ml-2">Items in Category</span>
                <div className="flex flex-col gap-2">{...budgetItems}</div>
                <fetcher.Form onSubmit={createNewBudgetItem}>
                    <button
                        type="submit"
                        className="bg-primary w-full mt-1 flex justify-center items-center gap-2 rounded-xl hover:bg-opacity-80 transition px-4 py-2"
                    >
                        Create New
                        <Icon type="plus-circle" className="size-5" />
                    </button>
                </fetcher.Form>
            </div>
        </div>
    )
}
