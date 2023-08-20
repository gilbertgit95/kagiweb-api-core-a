// import { Response, NextFunction } from 'express'
// import { AppRequest } from '../utilities/globalTypes'
import UAParser from 'ua-parser-js'

class ClientInfoProvider {
    public static async middleware(req:any, res:any, next:any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        const userAgentString = req.headers['user-agent']
        const userAgent = new UAParser(userAgentString)

        req.userAgentInfo = userAgent.getResult()

        // console.log('userAgentInfo: ', req.userAgentInfo)
        // console.log('clientIPAddress: ', req.clientIp)

        next()
    }
}

export default ClientInfoProvider.middleware