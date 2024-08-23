import { BudgetItem } from '@prisma/client'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { z } from 'zod'
import BudgetMenuForm from '~/components/budget/BudgetMenuForm'
import BudgetMenuItemAssignMoney from '~/components/budget/BudgetMenuItemAssignMoney'
import Icon from '~/components/icons/Icon'
import { useModal } from '~/context/ModalContext'
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
    console.log('received request to change budget item name', data)
    // const parsed = schema.parse(Object.fromEntries(data))
    // // TODO

    // console.log('updating budget item name ', parsed)
    // return {
    //     TEMP_DELETE_CAT_NAME: parsed.name,
    // }
    return null
}

export default function BudgetItemEditRoute() {
    const { data, budgetItem } = useLoaderData<typeof loader>()
    const allBudgetItems = [
        ...data.budgetCategories.map((bCat) => bCat.budgetItems).flat(),
    ] as unknown as BudgetItem[]

    const { theme } = useTheme()
    const themeStyle = theme === 'DARK' ? 'bg-black' : 'bg-white'
    const altThemeStyle = theme === 'DARK' ? 'bg-dark' : 'bg-light'

    const { setActive, setModalChildren } = useModal()
    const onAssignMoneyClick = () => {
        // quirk in which if you set a value, but then don't change it but exit modal, state is retained
        // only if key is same
        setModalChildren(
            <BudgetMenuItemAssignMoney
                key={budgetItem.id}
                budgetItems={allBudgetItems}
                target={budgetItem as unknown as BudgetItem}
            />
        )
        setActive(true)
    }

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
                <div className="mx-1 flex gap-3 items-center text-lg">
                    <span>Balance</span>
                    <hr className="bg-balance border-0 aspect-square h-2 rounded-full" />
                    <span className="ml-auto">
                        ${budgetItem.balance.toFixed(2)}
                    </span>
                </div>
            </div>
            <hr className={`h-[1px] border-none ${altThemeStyle} bg-subtle`} />
            <div className="flex flex-col w-full gap-1">
                <div className="mx-1 flex gap-3 items-center text-lg">
                    <span>Assigned</span>
                    <hr className="bg-assigned border-0 aspect-square h-2 rounded-full" />
                    <span className="ml-auto">
                        ${budgetItem.assigned.toFixed(2)}
                    </span>
                </div>
                <button
                    className={`${altThemeStyle} rounded-xl hover:bg-opacity-80 transition px-4 py-2 flex justify-center gap-2 items-center`}
                    onClick={onAssignMoneyClick}
                >
                    <span>Assign Money</span>
                    <Icon type="plus-circle" />
                </button>
            </div>
            <hr className={`h-[1px] border-none ${altThemeStyle} bg-subtle`} />
            <div className="flex flex-col w-full justify-center items-center relative">
                <div className="absolute mx-1 inset-0 flex text-lg w-fit h-fit gap-3 items-center">
                    <span className="text-transparent">Target</span>
                    <hr className="bg-target border-0 aspect-square h-2 rounded-full" />
                </div>
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
