interface IError {
    message: string
}

class ErrorHandler {
    public static async execute<Type>(process: () => Promise<Type | null>): Promise<[Type | IError | null, number]> {
        let result:Type | IError | null
        let statusCode: number

        try {
            result = await process()
            statusCode = 200
        } catch (err) {
            result = { message: 'Error while executing procedure.'}
            statusCode = 400
        }

        return [result, statusCode]
    }
}

export {
    IError
}
export default ErrorHandler