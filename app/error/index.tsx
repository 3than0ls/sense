/********************************************************
 *
 * When errors occur on the server, we need a consistent way of returning those errors to the client to be gracefully displayed.
 * Use the syntax `throw new ServerErrorResponse({})` to do this, and a Remix error boundary will catch it
 *
 ********************************************************/

export default class ServerErrorResponse extends Response {
    constructor(
        {
            message = 'Unexpected server error.',
            status = 500,
        }: {
            message?: string
            status?: number
        } = {
            message: 'Unexpected server error.',
            status: 500,
        }
    ) {
        super(message, {
            status,
        })
    }
}
