import { TLimitedTransactionType, IUser}  from '../dataSource/models/userModel'
import { IWorkspace } from '../dataSource/models/workspaceModel'

interface IUserInfoParams {
    user: IUser | undefined,
    workspace: IWorkspace | undefined,
}
interface ILTCallbackParams {
    type: TLimitedTransactionType,
    value: string,
    message: string
}

class AppCallbacks {
    public limitedTransactionCallback() {

    }
}

export {
    IUserInfoParams,
    ILTCallbackParams
}
export default new AppCallbacks