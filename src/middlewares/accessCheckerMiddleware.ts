// import { Response, NextFunction } from 'express'
// import { AppRequest } from '../utilities/globalTypes'
import { errorLogsColl, combinedLogsColl } from '../utilities/logger'

class AccessChecker {
    public async middleware(req:any, res:any, next:any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        console.log('AccessChecker')
        console.log('Authorization: ', req.headers.authorization)
        combinedLogsColl.log({level: 'info', message: 'access checker'})
        errorLogsColl.log({level: 'error', message: 'access checker'})
        next()
    }
}

export default (new AccessChecker()).middleware