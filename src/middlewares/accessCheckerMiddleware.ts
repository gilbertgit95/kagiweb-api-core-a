import { Response, NextFunction } from 'express'
import { AppRequest } from '../utilities/globalTypes'
import { errorLogsColl, combinedLogsColl } from '../utilities/logger'

class AccessChecker {
    public async middleware(req:AppRequest, res:Response, next:NextFunction) {
        console.log('AccessChecker')
        console.log('Authorization: ', req.headers.authorization)
        combinedLogsColl.log({level: 'info', message: 'access checker'})
        errorLogsColl.log({level: 'error', message: 'access checker'})
        next()
    }
}

export default (new AccessChecker()).middleware