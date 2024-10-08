import { json, LoaderFunctionArgs } from '@remix-run/node'
import { isAuthApiError } from '@supabase/supabase-js'
import ServerErrorResponse from '~/error'
import fullBudgetItemData from '~/prisma/fullBudgetItemData'
import authenticateUser from '~/utils/authenticateUser'

export async function loader({ params, request }: LoaderFunctionArgs) {
    try {
        const { user } = await authenticateUser(request)

        const budgetItem = await fullBudgetItemData({
            userId: user.id,
            budgetItemId: params.budgetItemId!,
        })

        return json(budgetItem)
    } catch (e) {
        if (isAuthApiError(e)) {
            throw new ServerErrorResponse(e)
        } else {
            return new ServerErrorResponse({
                message: 'Budget Item not found.',
                status: 404,
            })
            // throw new ServerErrorResponse({
            //     message: 'Budget Item not found.',
            //     status: 404,
            // })
        }
    }
}
