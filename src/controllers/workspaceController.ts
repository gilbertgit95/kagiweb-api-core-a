import DataCache from '../utilities/dataCache'
// import RoleModel, { IWorkspace, IWorkspaceQuery } from '../dataSource/models/roleModel'
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

    public async getWorkspace(query:{_id:string}):Promise<IWorkspace|null> {
        if (!query._id) return null
        return await this.cachedData.getItem(query._id)
    }

    public async getAllWorkspaces():Promise<IWorkspace[]> {

        const result = await this.cachedData.getAllItems<IWorkspace>()

        return result
    }

    public async getWorkspacesByPage(query:any, pageInfo: IPgeInfo):Promise<IListOutput<IWorkspace>> {

        const result = await this.request.getItemsByPage<IWorkspace>(query, {}, {}, pageInfo)

        return result
    }

    public async saveWorkspace(currUserId:string, name:string, description:string, isActive:string|boolean, disabled:string|boolean):Promise<IWorkspace | null> {
        const createdBy = currUserId
        const modifiedBy = currUserId

        const doc:IWorkspace = {name, description, createdBy, modifiedBy}
        if (DataCleaner.getBooleanData(isActive).isValid) doc.isActive = DataCleaner.getBooleanData(isActive).data
        if (DataCleaner.getBooleanData(disabled).isValid) doc.disabled = DataCleaner.getBooleanData(disabled).data

        const result = await this.cachedData.createItem<IWorkspace>(doc)

        return result
    }

    public async updateWorkspace(currUserId:string, workspaceId:string, name:string, description:string, isActive:string|boolean, disabled:string|boolean):Promise<IWorkspace | null> {
        const doc:{name?:string, description?:string, modifiedBy?:string, isActive?:boolean, disabled?:boolean} = {}

        if (name) doc.name = name
        if (description) doc.description = description
        if (currUserId) doc.modifiedBy = currUserId
        if (DataCleaner.getBooleanData(isActive).isValid) doc.isActive = DataCleaner.getBooleanData(isActive).data
        if (DataCleaner.getBooleanData(disabled).isValid) doc.disabled = DataCleaner.getBooleanData(disabled).data

        const result = await this.cachedData.updateItem<IWorkspace>(workspaceId, doc)

        return result
    }

    public async deleteWorkspace(currUserId:string, workspaceId:string):Promise<IWorkspace | null> {

        const result = await this.cachedData.deleteItem<IWorkspace>(workspaceId)

        return result
    }
}

export default new WorkspaceController()