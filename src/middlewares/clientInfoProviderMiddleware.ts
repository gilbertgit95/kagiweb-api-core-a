import { Request, Response, NextFunction } from 'express'
// import { AppRequest } from '../utilities/globalTypes'
import UAParser from 'ua-parser-js'

class ClientInfoProvider {
    /**
     * this middleware provides account agent info or account device info to request object
     * @param req 
     * @param res 
     * @param next 
     */
    public static async middleware(req:Request, res:Response, next:NextFunction) {
        const userAgentString = req.headers['user-agent']
        const userAgent = new UAParser(userAgentString)

        req.userAgentInfo = userAgent.getResult()

        // console.log('userAgentInfo: ', {...req.userAgentInfo})
        // console.log('clientIPAddress: ', req.clientIp)

        next()
    }
}

export default ClientInfoProvider.middleware