import DataCache from '../utilities/dataCache'
// import RoleModel, { IWorkspace, IWorkspaceQuery } from '../dataSource/models/roleModel'
import userController from './userController'
import WorkspaceModel, { IWorkspace, IUserRef } from '../dataSource/models/workspaceModel'
import DataRequest, { IListOutput, IPgeInfo } from '../utilities/dataQuery'
import DataCleaner from '../utilities/dataCleaner'
// import Config from '../utilities/config'

// const env = Config.getEnv()

class WorkspaceController {
    public cachedData:DataCache
    public request:DataRequest

    constructor() {
        this.cachedData = new DataCache(WorkspaceModel, { stdTTL: 30, checkperiod: 15 })
        this.request = new DataRequest(WorkspaceModel)
    }

    public async getWorkspace(isGlobal:boolean=false, currLoggedUser:string, query:{_id:string}):Promise<IWorkspace|null> {
        if (!query._id) return null
        const resp = await this.cachedData.getItem<IWorkspace>(query._id)
        // if not global, then check if the owner is the current logged user else throw error
        return resp
    }

    public async getWorkspacesByPage(isGlobal:boolean=false, currLoggedUser:string, query:any, pageInfo: IPgeInfo):Promise<IListOutput<IWorkspace>> {

        // if not global, then modify the query to only fetch current logged user as owner
        const result = await this.request.getItemsByPage<IWorkspace>(query, {}, {}, pageInfo)

        return result
    }

    public async saveWorkspace(isGlobal:boolean=false, currLoggedUser:string, owner:string, name:string, description:string, disabled:string|boolean):Promise<IWorkspace | null> {
        const createdBy = currLoggedUser
        const modifiedBy = currLoggedUser

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

    public async updateWorkspace(isGlobal:boolean=false, currLoggedUser:string, workspaceId:string, owner:string, name:string, description:string, disabled:string|boolean):Promise<IWorkspace | null> {
        
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

    public async deleteWorkspace(isGlobal:boolean=false, currLoggedUser:string, workspaceId:string):Promise<IWorkspace | null> {
        const workspace = await WorkspaceModel.findOne({_id: workspaceId})
        if (!workspace) throw({code: 404}) // Resource not found
        if (workspace.isActive) throw({code: 403, message: 'Cannot delete if workspace tobe deleted is active'})

        const ownerWorkspaces = await WorkspaceModel.find({owner: workspace.owner})
        if (ownerWorkspaces.length === 1) throw({code: 403, message: 'Cannot delete if the owner has only 1 workspace'}) // Forbidden access to resources.

        const result = await this.cachedData.deleteItem<IWorkspace>(workspaceId)

        return result
    }
}

export default new WorkspaceController()