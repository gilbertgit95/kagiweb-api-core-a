import UAParser from 'ua-parser-js'

class ClientInfoProvider {
    public async middleware(req:any, res:any, next:any) {
        const userAgentString = req.headers['user-agent']
        const userAgent = new UAParser(userAgentString)

        req.userAgentInfo = userAgent.getResult()

        console.log('userAgentInfo: ', req.userAgentInfo)
        console.log('clientIPAddress: ', req.clientIp)

        next()
    }
}

export default (new ClientInfoProvider()).middleware