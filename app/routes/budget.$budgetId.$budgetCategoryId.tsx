import { json, LoaderFunctionArgs, redirect } from '@remix-run/node'
import {
    Link,
    Outlet,
    useFetcher,
    useLoaderData,
    useMatches,
    useSearchParams,
} from '@remix-run/react'
import { isAuthApiError } from '@supabase/supabase-js'
import BudgetMenuForm from '~/components/budget/BudgetMenuForm'
import DeleteButton from '~/components/DeleteButton'
import DeleteForm from '~/components/DeleteForm'
import Divider from '~/components/Divider'
import Icon from '~/components/icons/Icon'
import { useModal } from '~/context/ModalContext'
import { useTheme } from '~/context/ThemeContext'
import ServerErrorResponse from '~/error'
import prisma from '~/prisma/client'
import authenticateUser from '~/utils/authenticateUser'
import categoryNameSchema from '~/zodSchemas/budgetCategory'

export async function loader({ request, params }: LoaderFunctionArgs) {
    try {
        const { user } = await authenticateUser(request)

        const budgetCategory = await prisma.budgetCategory.findFirst({
            where: {
                id: params.budgetCategoryId,
                budgetId: params.budgetId,
                budget: {
                    userId: user.id,
                },
            },
            include: {
                budgetItems: true,
            },
        })
        if (budgetCategory === null) {
            // could just redirect here but... eh...
            throw new Error()
        }

        return json(budgetCategory)
    } catch (e) {
        if (isAuthApiError(e)) {
            throw new ServerErrorResponse(e)
        } else {
            return redirect(`/budget/${params.budgetId}`)
            // throw new ServerErrorResponse({
            //     message: 'Budget Category not found.',
            //     status: 404,
            // })
        }
    }
}

export default function BudgetCategoryEditRoute() {
    // definitely should all be moved to it's own component
    const budgetCategory = useLoaderData<typeof loader>()

    const { theme } = useTheme()
    const themeStyle = theme === 'DARK' ? 'bg-black' : 'bg-white'
    const altThemeStyle = theme === 'DARK' ? 'bg-dark' : 'bg-light'

    const fetcher = useFetcher()

    const budgetItems = Array.from(budgetCategory.budgetItems, (budgetItem) => {
        return (
            <Link
                to={budgetItem.id}
                key={budgetItem.id}
                className={`${altThemeStyle} rounded-xl hover:bg-opacity-80 transition px-4 py-2 flex justify-between items-center`}
            >
                <span className="mr-1.5 w-full truncate">
                    {budgetItem.name}
                </span>
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
            { action: '/api/budItem/create', method: 'POST' }
        )
    }

    const { setModalChildren, setModalTitle, setActive } = useModal()
    const onDeleteClick = () => {
        setModalTitle('Confirm Deletion')
        setModalChildren(
            <DeleteForm
                deleteItemName={budgetCategory.name}
                fetcherAction="/api/budCat/delete"
                fetcherTarget={{ budgetCategoryId: budgetCategory.id }}
                // onSubmitLoad={() => navigate(`/budget/${budgetItem.budgetId}`)} //  <-- doesn't matter since auto-navigates back anyway
            >
                <span>
                    All budget items (and transactions to and form) under this
                    category will also be deleted.
                </span>
            </DeleteForm>
        )
        setActive(true)
    }

    const [searchParams] = useSearchParams()
    const focus = searchParams.get('f')

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
            className={`flex flex-col gap-4 size-full p-4 text-sm ${themeStyle} rounded-xl min-w-full h-fit`}
        >
            <div className="flex flex-col w-full justify-center items-center">
                <BudgetMenuForm
                    key={budgetCategory.name}
                    defaultValue={budgetCategory.name}
                    label="Name"
                    name="name"
                    schema={categoryNameSchema}
                    action="/api/budCat/rename"
                    itemUuid={budgetCategory.id}
                    focus={focus === 'name'}
                />
            </div>
            <Divider />
            <div className="w-full flex flex-col gap-1">
                <span className="text-lg ml-2">Items in Category</span>
                <div className="flex flex-col gap-2 min-w-full w-0">
                    {...budgetItems}
                </div>
                <fetcher.Form onSubmit={createNewBudgetItem}>
                    <button
                        type="submit"
                        className="bg-primary w-full mt-1 flex justify-center items-center gap-2 rounded-xl hover:bg-opacity-80 transition px-4 py-2"
                    >
                        Create Item
                        <Icon type="plus-circle" className="size-5" />
                    </button>
                </fetcher.Form>
            </div>
            <Divider className="mt-auto border-subtle" />
            <DeleteButton
                className="flex justify-center items-center gap-4 h-10"
                onClick={onDeleteClick}
            >
                Delete Category
                <Icon type="trash" className="size-5" />
            </DeleteButton>
        </div>
    )
}
