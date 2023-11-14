interface ICallbackParams {
    type: string,
    value: string,
    message: string
}

class AppCallbacks {
    private limitedTransactionCallback = () => {}
    public setLimitedTransactionCallback() {

    }
}

export {
    ICallbackParams
}
export default new AppCallbacks