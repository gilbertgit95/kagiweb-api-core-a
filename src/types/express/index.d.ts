import {IAccount, IClientDevice} from '../../dataSource/models/accountModel'
import { IRole } from '../../dataSource/models/roleModel'

// to make the file a module and avoid the TypeScript error
export {}

declare global {
  namespace Express {
    export interface Request {
        accessToken?: string | null,
        userAgentInfo?: IClientDevice | null,
        accountData?: IAccount | null,
        appRole?: IRole | null,
        accountRole?: IRole | null,
        workspaceRole?: IRole | null
    }
  }
}