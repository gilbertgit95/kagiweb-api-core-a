import DataCache from '../utilities/dataCache'
import RoleModel, { IRole } from '../dataSource/models/roleModel'
import DataRequest, { IListOutput, IPgeInfo } from '../utilities/dataQuery'
// import Config from '../utilities/config'

// const env = Config.getEnv()

class RoleController {
    public cachedData:DataCache
    public request:DataRequest

    constructor() {
        this.cachedData = new DataCache(RoleModel, { stdTTL: 120, checkperiod: 120 })
        this.request = new DataRequest(RoleModel)
    }

    public async getRole(query:any):Promise<IRole|null> {
        return await this.cachedData.getItem(query._id)
    }

    public async getAllRoles():Promise<IRole[]> {

        const result = await this.cachedData.getAllItems()

        return result
    }

    public async getRolesByPage(query:any = {}, pageInfo: IPgeInfo):Promise<IListOutput> {

        const result = await this.request.getItemsByPage(query, {}, {}, pageInfo)

        return result
    }

    public async saveRole(doc:IRole):Promise<IRole | null> {

        const result = await this.cachedData.createItem(doc)

        return result
    }

    public async updateRole(id:string, doc:any):Promise<IRole | null> {

        const result = await this.cachedData.updateItem(id, doc)

        return result
    }

    public async deleteRole(id:string):Promise<string | null> {

        const result = await this.cachedData.deleteItem(id)

        return result
    }
}

export default new RoleController()