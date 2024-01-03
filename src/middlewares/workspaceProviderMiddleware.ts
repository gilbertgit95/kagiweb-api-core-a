import { Request, Response, NextFunction } from 'express'
// import NodeCache from 'node-cache'
// import { AppRequest } from '../utilities/globalTypes'
// import { IWorkspace } from '../dataSource/models/workspaceModel'
// import workspaceController from '../controllers/workspaceController'
// import { errorLogsColl, combinedLogsColl } from '../utilities/logger'
import userWorkspacesController from '../controllers/userWorkspacesController'

class ClientInfoProvider {
    /**
     * this middleware inserts acitve workspace of a user into request object
     * @param req 
     * @param res 
     * @param next 
     */
    public static async middleware(req:Request, res:Response, next:NextFunction) {
        const user = req.userData
        req.userActiveWorkspace = user && user._id? await userWorkspacesController.getUserActiveWorkspace(user._id): null
        next()
    }
}

export default ClientInfoProvider.middleware