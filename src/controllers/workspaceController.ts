import DataCache from '../utilities/dataCache'
// import RoleModel, { IWorkspace, IWorkspaceQuery } from '../dataSource/models/roleModel'
import userController from './userController'
import workspaceUserController from './workspaceUserController'
import WorkspaceModel, { IWorkspace } from '../dataSource/models/workspaceModel'
import DataRequest, { IListOutput, IPgeInfo } from '../utilities/dataQuery'
import DataCleaner from '../utilities/dataCleaner'
// import { userActiveWorkspace } from '../middlewares/workspaceProviderMiddleware'
// import Config from '../utilities/config'

// const env = Config.getEnv()

class WorkspaceController {
    public cachedData:DataCache
    public request:DataRequest

    constructor() {
        this.cachedData = new DataCache(WorkspaceModel, { stdTTL: 30, checkperiod: 15 })
        this.request = new DataRequest(WorkspaceModel)
    }

    public getWorkspace(isGlobal:boolean=false, currLoggedUser:string):(query:{_id:string}) => Promise<IWorkspace|null> {

        return async (query:{_id:string}) => {
            if (!query._id) return null
            const workspace = await this.cachedData.getItem<IWorkspace>(query._id)
            // if not global, then check if the owner is the current logged user else throw error
            if (!isGlobal && !workspaceUserController.isCurrUserHasAccess(workspace, currLoggedUser, 'readAccess')) return null

            return workspace
        }
    }

    public getWorkspacesByPage(isGlobal:boolean=false, currLoggedUser:string):(query:any, pageInfo: IPgeInfo) => Promise<IListOutput<IWorkspace>> {

        return async (query:any, pageInfo: IPgeInfo) => {
            if (!isGlobal) {
                query = {
                    ...query,
                    ...{
                        '$or': [
                            {
                                'owner': currLoggedUser
                            },
                            {
                                'usersRefs.userId': currLoggedUser,
                                'usersRefs.readAccess': true
                            }
                        ]
                    }
                }
            }
            // if not global, then modify the query to only fetch current logged user as owner
            const result = await this.request.getItemsByPage<IWorkspace>(query, {}, {}, pageInfo)

            return result
        }
    }

    public saveWorkspace(isGlobal:boolean=false, currLoggedUser:string):(owner:string, name:string, description:string, disabled:string|boolean) => Promise<IWorkspace | null> {
        return async (owner:string, name:string, description:string, disabled:string|boolean) => {
            const createdBy = currLoggedUser
            const modifiedBy = currLoggedUser

            console.log('isGlobal: ', isGlobal)
            const doc:IWorkspace = {owner, name, description, createdBy, modifiedBy}

            const user = await userController.getUser({_id: owner})
            // if not global, then check if the owner is the current logged user else 
            if (!user) throw({code: 400, message: 'Owner does not exist as a user'})

            const ownerWorkspaces = await WorkspaceModel.find({ owner })
            if (ownerWorkspaces.length === 0) doc.isActive = true

            // if (DataCleaner.getBooleanData(isActive).isValid) doc.isActive = DataCleaner.getBooleanData(isActive).data
            if (DataCleaner.getBooleanData(disabled).isValid) doc.disabled = DataCleaner.getBooleanData(disabled).data

            const result = await this.cachedData.createItem<IWorkspace>(doc)

            return result
        }
    }

    public updateWorkspace(isGlobal:boolean=false, currLoggedUser:string):(workspaceId:string, owner:string, name:string, description:string, disabled:string|boolean) => Promise<IWorkspace | null> {
        return async (workspaceId:string, owner:string, name:string, description:string, disabled:string|boolean) => {
            if (!isGlobal) {
                // check if the current user is an owner or has read access to the workspace
                const workspace = await this.cachedData.getItem<IWorkspace>(workspaceId)
                if (!workspaceUserController.isCurrUserHasAccess(workspace, currLoggedUser, 'writeAccess')) {
                    throw({code: 403})
                }
            }
    
            const user = await userController.getUser({_id: owner})
            if (!user) throw({code: 400, message: 'Owner does not exist as a user'})
    
            const doc:{owner?:string, name?:string, description?:string, modifiedBy?:string, isActive?:boolean, disabled?:boolean} = {}
    
            if (owner) doc.owner = owner
            if (name) doc.name = name
            if (description) doc.description = description
            if (currLoggedUser) doc.modifiedBy = currLoggedUser
            // if (DataCleaner.getBooleanData(isActive).isValid) doc.isActive = DataCleaner.getBooleanData(isActive).data
            if (DataCleaner.getBooleanData(disabled).isValid) doc.disabled = DataCleaner.getBooleanData(disabled).data
    
            const result = await this.cachedData.updateItem<IWorkspace>(workspaceId, doc)

            return result
        }
    }

    public deleteWorkspace(isGlobal:boolean=false, currLoggedUser:string):(workspaceId:string) => Promise<IWorkspace | null> {

        return async (workspaceId:string) => {
            const workspace = await WorkspaceModel.findOne({_id: workspaceId})
            if (!workspace) throw({code: 404}) // Resource not found
            if (workspace.isActive) throw({code: 403, message: 'Cannot delete if workspace tobe deleted is active'})
            if (!isGlobal && !workspaceUserController.isCurrUserHasAccess(workspace, currLoggedUser, 'writeAccess')) {
                throw({code: 403})
            }

            const ownerWorkspaces = await WorkspaceModel.find({owner: workspace.owner})
            if (ownerWorkspaces.length === 1) throw({code: 403, message: 'Cannot delete if the owner has only 1 workspace'}) // Forbidden access to resources.

            const result = await this.cachedData.deleteItem<IWorkspace>(workspaceId)

            return result
        }
    }

    public selectOwnerWorkspace(isGlobal:boolean=false, currLoggedUser:string):(workspaceId:string, owner:string) => Promise<IWorkspace[] | null> {
        return async (workspaceId:string, owner:string) => {
            if (!(workspaceId && owner)) throw({code: 400})
            const userId = isGlobal? owner: currLoggedUser
            const workspaces = await WorkspaceModel.find({owner: userId})

            if (workspaces.some(item => item._id === workspaceId)) {
                for (const ws of workspaces) {
                    const status = Boolean(ws._id === workspaceId)
                    ws.isActive = status
                    await ws.save()
                    this.cachedData.removeCacheData(ws._id)
                }

                return workspaces
            }

            return null
        }
    }

}

export default new WorkspaceController()