interface IError {
    message: string
}

class ErrorHandler {
    public static async execute<Type>(process: () => Promise<Type | null>): Promise<[Type | IError, number]> {
        let result:Type | IError | null | undefined
        let statusCode: number

        try {
            result = await process()
            statusCode = 200
        } catch (err) {

            // default error status
            result = { message: 'Internal server error.'}
            statusCode = 500

            // check error 400
            if (err === 'Incorrect content in the request.') {
                result = { message: 'Username or password is incorrect.'}
                statusCode = 400
            }
        }

        // if result is null or undefined return error 404
        if (result === null || result === undefined) {
            result = { message: 'Requested data does not exist.'}
            statusCode = 404
        }

        return [result, statusCode]
    }
}

export {
    IError
}
export default ErrorHandler