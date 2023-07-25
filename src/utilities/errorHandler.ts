interface IError {
    message: string
}

class ErrorHandler {
    public static async execute(process:any): Promise<[any, any]> {
        try {
            return [process(), null]
        } catch (err) {
            return [{ message: 'Error while executing procedure.'}, 400]
        }
    }
}

export {
    IError
}
export default ErrorHandler