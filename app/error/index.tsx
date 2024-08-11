/********************************************************
 *
 * When errors occur on the server, we need a consistent way of returning those errors to the client to be gracefully displayed.
 * Return errors using this type so all client received errors can use this data to ideally display good data.
 * See `signup.tsx`'s action for an example on how it is used. *
 *
 ********************************************************/

export type ActionErrorType = {
    message: string // custom written or from external api, able to be shown to user, ex: "Parsing data error."
    code: string // usually comes from an external api, ex: "supabase's user_already_exist"
    status: number // http status code, ex: 400
}

// TODO: create a type for loader error type
