import { Request, Response, NextFunction } from 'express'
// import { AppRequest } from '../utilities/globalTypes'
import { IAccount } from '../dataSource/models/userModel'
import userController from '../controllers/userController'
import userRoleController from '../controllers/userRoleController'
import userClientDeviceController from '../controllers/userClientDeviceController'
import userClientDeviceAccessTokenController from '../controllers/userClientDeviceAccessTokenController'
import roleFeatureController from '../controllers/roleFeatureController'
import roleController from '../controllers/roleController'
// import { errorLogsColl, combinedLogsColl } from '../utilities/logger'
import ErrorHandler from '../utilities/errorHandler'
import Encryption from '../utilities/encryption'
import { RouterIdentity } from '../utilities/routerIdentity'

class UserInfoAndAccessProvider {
    /**
     * this midddleware inserts userdata into request object base on jwt data,
     * then checks user access
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    public static async middleware(req:Request, res:Response, next:NextFunction) {
        req.userData = null
        const [result, statusCode] = await ErrorHandler.execute<boolean>(async () => {
            const userAgentInfo = req.userAgentInfo
            const accessToken = req.headers.authorization
            const type = accessToken && accessToken.split(' ')[0]? accessToken.split(' ')[0]: null
            const token = accessToken && accessToken.split(' ')[1]? accessToken.split(' ')[1]: null
            let user:IAccount|null = null

            if (token && type === 'Bearer') {
                const tokenObj = await Encryption.verifyJWT<{userId:string}>(token)
                if (!(tokenObj && tokenObj.userId)) throw({code: 401})

                user = await userController.getUser({_id: tokenObj.userId}, true)
                req.userData = user
            } else {
                throw({code: 401}) // Unauthorize
            }

            // if user has been fetched, proceed to user access regulation process
            if (user && userAgentInfo) {
                // check the user devices if the acces token existed
                const clientDevice = userClientDeviceController.getClientDeviceByUA(user, userAgentInfo.ua)
                if ( clientDevice && clientDevice._id &&
                    !userClientDeviceAccessTokenController.hasClientDeviceAccessTokenJWT(user, clientDevice._id, token)) {
                    throw({code: 401})
                }

                // get active user roleref
                const activeRoleRef = userRoleController.getActiveRoleRef(user)
                if (!(activeRoleRef && activeRoleRef.roleId)) throw({code: 404})
                // get active role info
                const activeRole = await roleController.getMappedRole(activeRoleRef.roleId)
                if (!activeRole) throw({code: 404})

                // for the super administrator role
                if (activeRole && activeRole.absoluteAuthority) {
                    // console.log('absolute authority: ', activeRole.absoluteAuthority)
                    return true
                }

                // for roles that has specific accessable features
                const roleFeatures = await roleFeatureController.getMappedFeatures(activeRole)

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

export default UserInfoAndAccessProvider.middleware