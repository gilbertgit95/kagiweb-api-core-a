// import { Response, NextFunction } from 'express'
// import { AppRequest } from '../utilities/globalTypes'
import WorkspaceModel, { IWorkspace } from '../dataSource/models/workspaceModel'
import NodeCache, {Options} from 'node-cache'
import workspaceController from '../controllers/workspaceController'

// contains the users active cache for faster fetching
const userActiveWorkspaceCache = new NodeCache({ stdTTL: 30, checkperiod: 15 })

const getUserActiveWorkspace = async (userId:string):Promise<IWorkspace|null> => {
    let workspace:IWorkspace|null = userActiveWorkspaceCache.get(userId) || null
    if (!workspace) workspace = await workspaceController.request.getItem({owner: userId, isActive: true})
    // then return workspace
    return workspace
}

const setUserActiveWorkspace = (userId:string, workspace:IWorkspace):void => {
    userActiveWorkspaceCache.set(userId, workspace)
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
    setUserActiveWorkspace
}
export default ClientInfoProvider.middleware