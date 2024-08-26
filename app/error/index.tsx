/********************************************************
 *
 * When errors occur on the server, we need a consistent way of returning those errors to the client to be gracefully displayed.
 * Use the syntax `throw new ServerErrorResponse({})` to do this, and a Remix error boundary will catch it
 *
 ********************************************************/

export default class ServerErrorResponse extends Response {
    // constructor({
    //     message = 'Unexpected server error.',
    //     status = 500,
    //     code = 'unknown_server_error'
    // }:
    // {
    //     message?: string
    //     status?: number
    //     code?: string
    // }) {
    //     const formData = new FormData()
    //     formData.append('message', message)
    //     formData.append('code', code)
    //     super(message, {
    //         status,
    //     })
    // }

    constructor({
        message = 'Unexpected server error.',
        status = 500,
    }: {
        message?: string
        status?: number
    }) {
        super(message, {
            status,
        })
    }
}
