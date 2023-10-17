import DataCache from '../utilities/dataCache'
// import RoleModel, { IWorkspace, IWorkspaceQuery } from '../dataSource/models/roleModel'
import WorkspaceModel, { IWorkspace, IUserRef } from '../dataSource/models/workspaceModel'
import DataRequest, { IListOutput, IPgeInfo } from '../utilities/dataQuery'
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

    public async saveWorkspace(userId:string, name:string, description:string):Promise<IWorkspace | null> {
        const createdBy = userId
        const modifiedBy = userId
        const doc:IWorkspace = {name, description, createdBy, modifiedBy}
        const result = await this.cachedData.createItem<IWorkspace>(doc)

        return result
    }

    public async updateWorkspace(userId:string, workspaceId:string, name:string, level:number, description:string):Promise<IWorkspace | null> {
        const doc:{name?:string, description?:string, modifiedBy?:string} = {}

        if (name) doc.name = name
        if (description) doc.description = description
        if (userId) doc.modifiedBy = userId

        const result = await this.cachedData.updateItem<IWorkspace>(workspaceId, doc)

        return result
    }

    public async deleteWorkspace(id:string):Promise<IWorkspace | null> {

        const result = await this.cachedData.deleteItem<IWorkspace>(id)

        return result
    }
}

export default new WorkspaceController()