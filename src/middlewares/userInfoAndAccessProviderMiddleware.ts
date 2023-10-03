// import { Response, NextFunction } from 'express'
// import { AppRequest } from '../utilities/globalTypes'
import { IUser } from '../dataSource/models/userModel'
import userController from '../controllers/userController'
import userRoleController from '../controllers/userRoleController'
import roleFeatureController from '../controllers/roleFeatureController'
import roleController from '../controllers/roleController'
import { errorLogsColl, combinedLogsColl } from '../utilities/logger'
import ErrorHandler from '../utilities/errorHandler'
import Encryption from '../utilities/encryption'
import { RouterIdentity } from '../utilities/appHandler'

class UserInfoProvider {
    public static async middleware(req:any, res:any, next:any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        req.userData = null
        const [result, statusCode] = await ErrorHandler.execute<boolean>(async () => {
            const accessToken = req.headers.authorization
            const type = accessToken && accessToken.split(' ')[0]? accessToken.split(' ')[0]: null
            const token = accessToken && accessToken.split(' ')[1]? accessToken.split(' ')[1]: null
            let user:IUser|null = null

            if (token && type === 'Bearer') {
                const tokenObj = await Encryption.verifyJWT<{userId:string}>(token)
                if (!(tokenObj && tokenObj.userId)) throw({code: 401})

                user = await userController.getUser({_id: tokenObj.userId})
                req.userData = user
            } else {
                throw({code: 401}) // Unauthorize
            }

            // if user has been fetched, proceed to user access regulation process
            if (user) {
                // get active user roleref
                const activeRoleRef = userRoleController.getActiveRoleRef(user)
                if (!(activeRoleRef && activeRoleRef.roleId)) throw({code: 404})
                // get active role info
                const activeRole = await roleController.getMappedRole(activeRoleRef.roleId)
                if (!activeRole) throw({code: 404})

                // for the super administrator role
                if (activeRole && activeRole.absoluteAuthority) {
                    console.log('absolute authority: ', activeRole.absoluteAuthority)
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

export default UserInfoProvider.middleware