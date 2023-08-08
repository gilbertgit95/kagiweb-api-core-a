import DataCache from '../utilities/dataCache'
import RoleModel, { IRole, IRoleQuery } from '../dataSource/models/roleModel'
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

    public async getRole(query:IRoleQuery):Promise<IRole|null> {
        if (!query._id) return null
        return await this.cachedData.getItem(query._id)
    }

    public async getAllRoles():Promise<IRole[]> {

        const result = await this.cachedData.getAllItems<IRole>()

        return result
    }

    public async getRolesByPage(query:IRoleQuery = {}, pageInfo: IPgeInfo):Promise<IListOutput<IRole>> {

        const result = await this.request.getItemsByPage<IRole>(query, {}, {}, pageInfo)

        return result
    }

    public async saveRole(doc:IRole):Promise<IRole | null> {

        const result = await this.cachedData.createItem(doc)

        return result
    }

    public async updateRole(id:string, doc:IRole):Promise<IRole | null> {

        const result = await this.cachedData.updateItem<IRole>(id, doc)

        return result
    }

    public async deleteRole(id:string):Promise<IRole | null> {

        const result = await this.cachedData.deleteItem<IRole>(id)

        return result
    }
}

export default new RoleController()