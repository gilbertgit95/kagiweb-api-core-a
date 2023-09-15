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
            // Incorrect content in the request
            if (err === 400) {
                statusCode = err
                result = { message: 'Incorrect content in the request.'}
            }
            // check error 400
            // Unauthorized.
            else if (err === 401) {
                statusCode = err
                result = { message: 'Unauthorized.'}
            }
            // check error 400
            // Forbidden access to resources.
            else if (err === 403) {
                statusCode = err
                result = { message: 'Forbidden access to resources.'}
            }
            // Resource not found
            else if (err === 404) {
                statusCode = err
                result = { message: 'Resource not found'}
            }
            // Not Allowed
            else if (err === 405) {
                statusCode = err
                result = { message: 'Not Allowed'}
            }
            // Conflict
            else if (err === 409) {
                statusCode = err
                result = { message: 'Conflict'}
            }
            // is locked
            else if (err === 423) {
                statusCode = err
                result = { message: 'Locked.'}
            }
            // default error status
            else {
                console.log('errorHandler', err)
                result = { message: 'Internal server error.'}
                statusCode = 500
            }
        }

        // if result is null or undefined return error 404
        if (result === null || result === undefined) {
            result = { message: 'Resource not found'}
            statusCode = 404
        }

        return [result, statusCode]
    }
}

export {
    IError
}
export default ErrorHandler