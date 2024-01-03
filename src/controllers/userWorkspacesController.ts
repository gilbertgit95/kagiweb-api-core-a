import NodeCache from 'node-cache'
import WorkspaceModel, { IWorkspace } from '../dataSource/models/workspaceModel'

class UserWorkspacesController {
    // contains the users active workspace cache for faster fetching
    public userActiveWorkspaceCache = new NodeCache({ stdTTL: 30, checkperiod: 15 })
    // contains the users workspaces cache for faster fetching
    public userWorkspacesCache = new NodeCache({ stdTTL: 30, checkperiod: 15 })

    /**
     * this get workspace from cache or if not available, then it fetches from database
     * then cached save it in cache
     * @param userId 
     * @returns 
     */
    public getUserActiveWorkspace = async (userId:string):Promise<IWorkspace|null> => {
        // const cacheData = this.userActiveWorkspaceCache.get(userId)
        // let workspace:IWorkspace|null = JSON.parse(typeof cacheData === 'string'? cacheData: '')
        
        // if (!workspace) {
        //     workspace = await WorkspaceModel.findOne({owner: userId, isActive: true})
        //     this.userActiveWorkspaceCache.set(userId, JSON.stringify(workspace))
        // }
        // // then return workspace
        // return workspace

        let item:IWorkspace|null = null

        // check if the user existed on the cache
        // if it existed, then return from cache
        if (userId) {
            if (this.userActiveWorkspaceCache.has(userId)) {
                const cacheData = this.userActiveWorkspaceCache.get(userId)
                item = JSON.parse(typeof cacheData === 'string'? cacheData: '')
            } else {
                // else if not, then fetch user from database
                item = await WorkspaceModel.findOne({owner: userId, isActive: true})
                // then save the item to cache, then return item
                if (item && item.owner) this.userActiveWorkspaceCache.set(item.owner, JSON.stringify(item))
            }
        }

        return item
    }

    /**
     * this will save user active workspace to cache
     * @param userId 
     * @param workspace 
     */
    public setUserActiveWorkspace = (userId:string, workspace:IWorkspace):void => {
        this.userActiveWorkspaceCache.set(userId, JSON.stringify(workspace))
    }

    /**
     * this get workspace from cache or if not available, then it fetches from database
     * then cached save it in cache
     * @param userId 
     * @returns 
     */
    public getUserWorkspaces = async (userId:string):Promise<IWorkspace[]|null> => {
        // const cacheData = this.userWorkspacesCache.get(userId)
        // let workspaces = JSON.parse(typeof cacheData === 'string'? cacheData: '')
        // if (!workspaces) {
        //     workspaces = await WorkspaceModel.find({owner: userId})
        //     this.userWorkspacesCache.set(userId, JSON.stringify(workspaces))
        // }
        // // then return user workspaces
        // return workspaces

        let result = []

        if (this.userWorkspacesCache.has(userId)) {
            const cacheData = this.userWorkspacesCache.get(userId)
            result = JSON.parse(typeof cacheData === 'string'? cacheData: '')
        } else {
            const resp = await WorkspaceModel.find({owner: userId})

            if (resp) {
                result = resp
                this.userWorkspacesCache.set(userId, JSON.stringify(result))
            }
        }

        return result
    }

    /**
     * this will save user workspaces to cache
     * @param userId 
     * @param workspace 
     */
    public setUserWorkspaces = (userId:string, workspaces:IWorkspace[]):void => {
        this.userWorkspacesCache.set(userId, JSON.stringify(workspaces))
    }

    /**
     * this will remove user workspaces from cache
     * @param userId 
     */
    public removeUserCacheWorkspaces = (userId:string):void => {
        this.userWorkspacesCache.del(userId)
        this.userActiveWorkspaceCache.del(userId)
    }
}

export default new UserWorkspacesController()