import { Request, Response, NextFunction } from 'express'
// import { AppRequest } from '../utilities/globalTypes'
import { IAccount } from '../dataSource/models/accountModel'
import accountAccountConfigController from '../controllers/accountAccountConfigController'
import accountController from '../controllers/accountController'
// import accountRoleController from '../controllers/accountRoleController'
import accountClientDeviceController from '../controllers/accountClientDeviceController'
import accountClientDeviceAccessTokenController from '../controllers/accountClientDeviceAccessTokenController'
import roleFeatureController from '../controllers/roleFeatureController'
import roleController from '../controllers/roleController'
// import { errorLogsColl, combinedLogsColl } from '../utilities/logger'
import ErrorHandler from '../utilities/errorHandler'
import Encryption from '../utilities/encryption'
import Config, {Env} from '../utilities/config'
// import appEvents from './appEvents'

const env = Config.getEnv()
import { RouterIdentity } from '../utilities/routerIdentity'

class AccountInfoAndAccessProvider {
    public static parseAccountAndWorspaceId(path?:string):{workspaceId?:string, accountId?:string} {
        let result:{workspaceId?:string, accountId?:string} = {
            accountId: undefined,
            workspaceId: undefined
        }

        if (path) {
            const accountSubRoute = path.split('/accounts/')[1]
            const workspaceSubRoute = path.split('/workspaces/')[1]

            const accountId = accountSubRoute?.split('/')[0]
            const workspaceId = workspaceSubRoute?.split('/')[0]

            result = {
                accountId,
                workspaceId
            }
        }

        return result
    }

    /**
     * this midddleware inserts accountdata into request object base on jwt data,
     * then checks account access
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    public static async middleware(req:Request, res:Response, next:NextFunction) {
        req.accountData = null
        const [result, statusCode] = await ErrorHandler.execute<boolean>(async () => {
            const userAgentInfo = req.userAgentInfo
            const accessToken = req.headers.authorization
            const type = accessToken && accessToken.split(' ')[0]? accessToken.split(' ')[0]: null
            const token = accessToken && accessToken.split(' ')[1]? accessToken.split(' ')[1]: null
            let account:IAccount|null = null

            // assign access token to request
            req.accessToken = token

            if (token && type === 'Bearer') {
                const tokenObj = await Encryption.verifyJWT<{accountId:string}>(token)
                if (!(tokenObj && tokenObj.accountId)) throw({code: 401})

                account = await accountController.getAccount({_id: tokenObj.accountId}, true)
                req.accountData = account
            } else {
                throw({code: 401}) // Unauthorize
            }

            // if account has been fetched, proceed to account access regulation process
            if (account && userAgentInfo) {
                // check the account devices if the acces token existed
                const clientDevice = accountClientDeviceController.getClientDeviceByUA(account, userAgentInfo.ua)
                if (!clientDevice) {
                    throw({code: 401, message: 'No access due to unrecognized user agent.'})
                }
                if ( clientDevice && clientDevice._id &&
                    !accountClientDeviceAccessTokenController.hasClientDeviceAccessTokenJWT(account, clientDevice._id, token)) {
                    throw({code: 401})
                }

                // get active account roleref
                // get this data by default
                const defaultAppRole = accountAccountConfigController.getAccountConfigByKey(account, 'default-role')
                if (!(defaultAppRole && defaultAppRole.value)) throw({code: 404})
                // get active role info
                const appRole = await roleController.getMappedRole(defaultAppRole.value)
                req.appRole = appRole
                if (!appRole) throw({code: 404})
                // for the super administrator role
                if (appRole && appRole.absoluteAuthority) {
                    // console.log('absolute authority: ', appRole.absoluteAuthority)
                    return true
                }
                // for roles that has specific accessable features
                const appRoleFeatures = await roleFeatureController.getMappedFeatures(appRole)


                const { accountId, workspaceId } = AccountInfoAndAccessProvider.parseAccountAndWorspaceId(req.path)
                if (accountId) {
                    const defaultAccountRole = null
                    // logic here: todo
                }
                if (accountId && workspaceId) {
                    const defaultWorkspaceRole = null
                    // logic here: todo

                }

                // check if the role can access the request path
                if(!RouterIdentity.pathHasMatch(appRoleFeatures, {path: req.path, method: req.method})) {
                    throw({code: 401})
                }
            }

            return true
        })

        if (statusCode === 200) return next()
        return res.status(statusCode).send(result)
    }
}

export default AccountInfoAndAccessProvider.middleware