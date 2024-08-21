import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { Form, Link, useLoaderData, useMatches } from '@remix-run/react'
import { z } from 'zod'
import BudgetMenuForm from '~/components/budget/BudgetMenuForm'
import Icon from '~/components/icons/Icon'
import { useTheme } from '~/context/ThemeContext'
import fakeData from '~/utils/fakeData'

export async function loader({ params }: LoaderFunctionArgs) {
    console.log('LOADING BUDGET ITEM ID', params.budgetItemId)

    // split between just using outlet context to cut out another fetching step,
    // but will likely do a refetch so revalidating is easy

    // fetch budget from database using budgetId
    // get user from supabase auth getUser
    // ensure userId from budget and user.id from supabase auth match
    // if not, redirect to home
    // if yes, return budget data

    // in the meantime, here's some fake data
    const data = fakeData()

    const budgetItem = data.budgetCategories
        .find(
            (budgetCategory) => budgetCategory.id === params.budgetCategoryId
        )!
        .budgetItems.find(
            (budgetItem) => budgetItem.id === params.budgetItemId
        )!

    // THROW ERROR IF BUDGETCATEGORY SOMEHOW NOT FOUND (someone manually type invalid request/params) and return error to client

    return { data, budgetItem }
}

const nameSchema = z.object({
    name: z.string().min(1, 'Item name cannot be empty.'),
})
const valueSchema = z
    .string()
    .min(1, 'Value cannot be empty')
    // https://regex101.com/r/mZ1tX2/1
    // https://stackoverflow.com/questions/2811031/decimal-or-numeric-values-in-regular-expression-validation "Fractional Numbers, Positive"
    .regex(
        new RegExp(/^(0|[1-9]\d*)?(\.\d+)?(?<=\d)$/),
        'Value must be a non-negative number.'
    )
    .refine(
        (value) => {
            // I despise working with regex
            const split = value.split('.')
            return split.length === 1 || split[1].length <= 2
        },
        { message: 'Value can have at most 2 decimal points.' }
    )

    .transform((value) => {
        const pFloat = +parseFloat(value).toFixed(2)
        return pFloat
    })

export async function action({ request }: ActionFunctionArgs) {
    const data = await request.formData()
    console.log(data)
    // const parsed = schema.parse(Object.fromEntries(data))
    // // TODO

    // console.log('updating budget item name ', parsed)
    // return {
    //     TEMP_DELETE_CAT_NAME: parsed.name,
    // }
    return null
}

export default function BudgetItemEditRoute() {
    const { budgetItem } = useLoaderData<typeof loader>()

    const { theme } = useTheme()
    const themeStyle = theme === 'DARK' ? 'bg-black' : 'bg-white'
    const altThemeStyle = theme === 'DARK' ? 'bg-dark' : 'bg-light'

    return (
        <div
            className={`flex flex-col gap-4 size-full p-4 text-sm ${themeStyle} rounded-xl w-full h-full`}
        >
            <div className="flex flex-col w-full justify-center items-center">
                <BudgetMenuForm
                    key={budgetItem.name}
                    defaultValue={budgetItem.name}
                    label="Name"
                    name="name"
                    schema={nameSchema}
                />
            </div>
            <hr className={`h-[1px] border-none ${altThemeStyle} bg-subtle`} />
            <div className="flex flex-col w-full gap-1">
                <div className="mx-1 flex justify-between text-lg text-balance">
                    <span>Balance</span>
                    <span>${budgetItem.balance.toFixed(2)}</span>
                </div>
            </div>
            <hr className={`h-[1px] border-none ${altThemeStyle} bg-subtle`} />
            <div className="flex flex-col w-full gap-1">
                <div className="mx-1 flex justify-between text-lg text-assigned">
                    <span>Assigned</span>
                    <span>${budgetItem.assigned.toFixed(2)}</span>
                </div>
                <button
                    className={`${altThemeStyle} rounded-xl hover:bg-opacity-80 transition px-4 py-2 flex justify-center gap-2 items-center`}
                >
                    <span>Assign Money</span>
                    <Icon type="plus-circle" />
                </button>
            </div>
            <hr className={`h-[1px] border-none ${altThemeStyle} bg-subtle`} />
            <div className="flex flex-col w-full justify-center items-center text-target">
                <BudgetMenuForm
                    key={budgetItem.target}
                    defaultValue={budgetItem.target.toFixed(2).toString()}
                    label="Target"
                    name="target"
                    schema={z.object({
                        target: valueSchema,
                    })}
                />
            </div>
        </div>
    )
}
