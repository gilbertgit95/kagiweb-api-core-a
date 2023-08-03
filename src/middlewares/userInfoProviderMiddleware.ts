// import { Response, NextFunction } from 'express'
// import { AppRequest } from '../utilities/globalTypes'
import userController from '../controllers/userController'

class UserInfoProvider {
    public async middleware(req:any, res:any, next:any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        req.userInfo = await userController.getUser({_id: 'd3a2b6c1-e3a7-43ff-a778-00bd231ca1a5'})
        console.log('UserInfoProvider')
        next()
    }
}

export default (new UserInfoProvider()).middleware