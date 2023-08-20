// import { Response, NextFunction } from 'express'
// import { AppRequest } from '../utilities/globalTypes'
import { errorLogsColl, combinedLogsColl } from '../utilities/logger'

class OwnerOnly {
    public static async middleware(req:any, res:any, next:any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        console.log('OwnerOnly')
        next()
    }
}

export default OwnerOnly.middleware