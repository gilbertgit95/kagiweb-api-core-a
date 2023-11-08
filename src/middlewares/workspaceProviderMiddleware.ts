// import { Response, NextFunction } from 'express'
// import { AppRequest } from '../utilities/globalTypes'
import { IWorkspace } from '../dataSource/models/workspaceModel'
import NodeCache from 'node-cache'
import workspaceController from '../controllers/workspaceController'
// import { errorLogsColl, combinedLogsColl } from '../utilities/logger'

class UserActiveWorkspace {
    // contains the users active workspace cache for faster fetching
    public userActiveWorkspaceCache = new NodeCache({ stdTTL: 30, checkperiod: 15 })

    /**
     * this get workspace from cache or if not available, then it fetches from database
     * then cached save it in cache
     * @param userId 
     * @returns 
     */
    public getUserActiveWorkspace = async (userId:string):Promise<IWorkspace|null> => {
        let workspace:IWorkspace|null = this.userActiveWorkspaceCache.get(userId) || null
        if (!workspace) {
            workspace = await workspaceController.request.getItem({owner: userId, isActive: true})
            this.userActiveWorkspaceCache.set(userId, workspace)
        }
        // then return workspace
        return workspace
    }

    /**
     * this will save user active workspace to cache
     * @param userId 
     * @param workspace 
     */
    public setUserActiveWorkspace = (userId:string, workspace:IWorkspace):void => {
        this.userActiveWorkspaceCache.set(userId, workspace)
    }

    /**
     * this will remove user active workspace from cache
     * @param userId 
     */
    public removeUserActiveWorkspace = (userId:string):void => {
        this.userActiveWorkspaceCache.del(userId)
    }
}

const userActiveWorkspace = new UserActiveWorkspace()

class ClientInfoProvider {
    /**
     * this middleware inserts acitve workspace of a user into request object
     * @param req 
     * @param res 
     * @param next 
     */
    public static async middleware(req:any, res:any, next:any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        const user = req.userData
        req.userActiveWorkspace = await userActiveWorkspace.getUserActiveWorkspace(user._id)
        next()
    }
}

export {
    userActiveWorkspace
}
export default ClientInfoProvider.middleware