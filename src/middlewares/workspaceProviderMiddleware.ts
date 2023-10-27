// import { Response, NextFunction } from 'express'
// import { AppRequest } from '../utilities/globalTypes'
import workspaceController from '../controllers/workspaceController'

class ClientInfoProvider {
    public static async middleware(req:any, res:any, next:any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        const user = req.userData
        req.userActiveWorkspace = await workspaceController.request.getItem({owner: user._id, isActive: true})
        next()
    }
}

export default ClientInfoProvider.middleware