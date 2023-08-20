// import { Response, NextFunction } from 'express'
// import { AppRequest } from '../utilities/globalTypes'
import userController from '../controllers/userController'

import ErrorHandler from '../utilities/errorHandler'
import Encryption from '../utilities/encryption'

class UserInfoProvider {
    public static async middleware(req:any, res:any, next:any) { // eslint-disable-line @typescript-eslint/no-explicit-any

        const [result, statusCode] = await ErrorHandler.execute<boolean>(async () => {
            const accessToken = req.headers.authorization
            const type = accessToken && accessToken.split(' ')[0]? accessToken.split(' ')[0]: null
            const token = accessToken && accessToken.split(' ')[1]? accessToken.split(' ')[1]: null

            if (token && type === 'Bearer') {
                const tokenObj = await Encryption.verifyJWT<{userId:string}>(token)
                if (!(tokenObj && tokenObj.userId)) throw(401)

                req.userInfo = await userController.getUser({_id: tokenObj.userId})
                return Boolean(req.userInfo)
            } else {
                throw(401)
            }
        })
    
        if (statusCode === 200) return next()
        return res.status(statusCode).send(result)
    }
}

export default UserInfoProvider.middleware