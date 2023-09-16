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
        } catch (err:any) {
            const errCode = err?.code
            const errMessage = err?.message

            // Incorrect content in the request
            if (errCode && errCode === 400) {
                statusCode = errCode
                result = { message: errMessage? errMessage: 'Incorrect content in the request.'}
            }
            // check error 400
            // Unauthorized.
            else if (errCode && errCode === 401) {
                statusCode = errCode
                result = { message: errMessage? errMessage: 'Unauthorized.'}
            }
            // check error 400
            // Forbidden access to resources.
            else if (errCode && errCode === 403) {
                statusCode = errCode
                result = { message: errMessage? errMessage: 'Forbidden access to resources.'}
            }
            // Resource not found
            else if (errCode && errCode === 404) {
                statusCode = errCode
                result = { message: errMessage? errMessage: 'Resource not found'}
            }
            // Not Allowed
            else if (errCode && errCode === 405) {
                statusCode = errCode
                result = { message: errMessage? errMessage: 'Not Allowed'}
            }
            // Conflict
            else if (errCode && errCode === 409) {
                statusCode = errCode
                result = { message: errMessage? errMessage: 'Conflict'}
            }
            // is locked
            else if (errCode && errCode === 423) {
                statusCode = errCode
                result = { message: errMessage? errMessage: 'Locked.'}
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