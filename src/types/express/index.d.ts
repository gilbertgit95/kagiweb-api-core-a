import {IAccount, IClientDevice} from '../../dataSource/models/accountModel'

// to make the file a module and avoid the TypeScript error
export {}

declare global {
  namespace Express {
    export interface Request {
        accessToken?: string | null,
        userAgentInfo?: IClientDevice | null,
        accountData?: IAccount | null
    }
  }
}