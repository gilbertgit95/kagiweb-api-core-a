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
import { RouterIdentity } from '../utilities/routerIdentity'

class AccountInfoAndAccessProvider {
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
                const defaultConfigRole = accountAccountConfigController.getAccountConfigByKey(account, 'default-role')
                if (!(defaultConfigRole && defaultConfigRole.value)) throw({code: 404})
                // get active role info
                const defaultRole = await roleController.getMappedRole(defaultConfigRole.value)
                if (!defaultRole) throw({code: 404})

                // for the super administrator role
                if (defaultRole && defaultRole.absoluteAuthority) {
                    // console.log('absolute authority: ', defaultRole.absoluteAuthority)
                    return true
                }

                // for roles that has specific accessable features
                const roleFeatures = await roleFeatureController.getMappedFeatures(defaultRole)

                // check if the role can access the request path
                if(!RouterIdentity.pathHasMatch(roleFeatures, {path: req.path, method: req.method})) {
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