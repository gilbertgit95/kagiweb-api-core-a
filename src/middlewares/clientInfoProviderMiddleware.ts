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
        const accountAgentString = req.headers['user-agent']
        const accountAgent = new UAParser(accountAgentString)

        req.accountAgentInfo = accountAgent.getResult()

        // console.log('accountAgentInfo: ', {...req.accountAgentInfo})
        // console.log('clientIPAddress: ', req.clientIp)

        next()
    }
}

export default ClientInfoProvider.middleware