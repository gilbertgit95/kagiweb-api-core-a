// import {IResult} from 'ua-parser-js'
import {IUser, IClientDevice} from '../../dataSource/models/userModel'
import {IWorkspace} from '../../dataSource/models/workspaceModel'


// to make the file a module and avoid the TypeScript error
export {}

declare global {
  namespace Express {
    export interface Request {
        userAgentInfo?: IClientDevice | null,
        userData?: IUser | null
    }
  }
}