// import { Response, NextFunction } from 'express'
// import { AppRequest } from '../utilities/globalTypes'
import { IWorkspace } from '../dataSource/models/workspaceModel'
import NodeCache from 'node-cache'
import workspaceController from '../controllers/workspaceController'
// import { errorLogsColl, combinedLogsColl } from '../utilities/logger'

// contains the users active workspace cache for faster fetching
const userActiveWorkspaceCache = new NodeCache({ stdTTL: 30, checkperiod: 15 })

/**
 * this get workspace from cache or if not available, then it fetches from database
 * then cached save it in cache
 * @param userId 
 * @returns 
 */
const getUserActiveWorkspace = async (userId:string):Promise<IWorkspace|null> => {
    let workspace:IWorkspace|null = userActiveWorkspaceCache.get(userId) || null
    if (!workspace) {
        workspace = await workspaceController.request.getItem({owner: userId, isActive: true})
        userActiveWorkspaceCache.set(userId, workspace)
    }
    // then return workspace
    return workspace
}

/**
 * this will save user active workspace to cache
 * @param userId 
 * @param workspace 
 */
const setUserActiveWorkspace = (userId:string, workspace:IWorkspace):void => {
    userActiveWorkspaceCache.set(userId, workspace)
}

/**
 * this will remove user active workspace from cache
 * @param userId 
 */
const removeUserActiveWorkspace = (userId:string):void => {
    userActiveWorkspaceCache.del(userId)
}

class ClientInfoProvider {
    /**
     * this middleware inserts acitve workspace of a user into request object
     * @param req 
     * @param res 
     * @param next 
     */
    public static async middleware(req:any, res:any, next:any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        const user = req.userData
        req.userActiveWorkspace = await getUserActiveWorkspace(user._id)
        next()
    }
}

export {
    userActiveWorkspaceCache,
    getUserActiveWorkspace,
    setUserActiveWorkspace,
    removeUserActiveWorkspace
}
export default ClientInfoProvider.middleware