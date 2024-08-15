import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { z } from 'zod'
import BudgetMenuForm from '~/components/budget/BudgetMenuForm'
import Icon from '~/components/icons/Icon'
import { useTheme } from '~/context/ThemeContext'
import fakeData from '~/utils/fakeData'

export async function loader({ params }: LoaderFunctionArgs) {
    console.log(params.budgetId, params.budgetCategoryId)

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

const schema = z.object({
    name: z.string().min(1, 'Category name cannot be empty.'),
})

export async function action({ request }: ActionFunctionArgs) {
    const data = await request.formData()
    // TODO

    console.log('updating category name ', data)
    return {}
}

export default function BudgetCategoryEditRoute() {
    const { budgetCategory } = useLoaderData<typeof loader>()
    console.log(budgetCategory.name)

    const { theme } = useTheme()
    const themeStyle = theme === 'DARK' ? 'bg-black' : 'bg-white'
    const altThemeStyle = theme === 'DARK' ? 'bg-dark' : 'bg-light'

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

    return (
        <div
            className={`flex flex-col gap-4 size-full p-4 text-sm ${themeStyle} rounded-xl w-full h-full`}
        >
            <div className="flex flex-col w-full justify-center items-center">
                <BudgetMenuForm
                    defaultValue={budgetCategory.name}
                    label="Name"
                    name="name"
                    schema={schema}
                />
            </div>
            <hr className={`h-[1px] border-none ${altThemeStyle} bg-subtle`} />
            <div className="w-full flex flex-col gap-1">
                <span className="text-lg ml-2">Items in Category</span>
                <div className="flex flex-col gap-2">{...budgetItems}</div>
                {/* <Link className="text-lg">Create new</Link> */}
            </div>
        </div>
    )
}
