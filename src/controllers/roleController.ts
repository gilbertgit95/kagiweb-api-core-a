import DataCache from '../utilities/dataCache'
import RoleModel, { IRole, IRoleQuery } from '../dataSource/models/roleModel'
import DataRequest, { IListOutput, IPgeInfo } from '../utilities/dataQuery'
// import Config from '../utilities/config'

// const env = Config.getEnv()

class RoleController {
    public cachedData:DataCache
    public request:DataRequest

    constructor() {
        this.cachedData = new DataCache(RoleModel, { stdTTL: 30, checkperiod: 15 })
        this.request = new DataRequest(RoleModel)
    }

    public async getRolesMap():Promise<{[key:string]:IRole}> {
        const allRoles = await this.getAllRoles()

        return !allRoles? {}: allRoles.reduce((acc:{[key:string]:IRole}, item:IRole) => {
            if (item && item._id) acc[item._id] = item
            return acc
        }, {})
    }

    public async getLeastRole():Promise<IRole|null> {
        let result:IRole|null = null

        const roles = await this.getAllRoles()

        if (roles) {
            if (roles.length > 1) {
                result = roles
                    .sort((a, b) => {
                        return b.level - a.level
                    })[0]
            } else {
                result = roles[0]
            }
        }

        return result
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

    public async saveRole(name:string, level:number, description:string):Promise<IRole | null> {
        const doc:IRole = {name, level, description}
        const result = await this.cachedData.createItem<IRole>(doc)

        return result
    }

    public async updateRole(id:string, name:string, level:number, description:string):Promise<IRole | null> {
        const doc:{name?:string, level?:number, description?:string} = {}

        if (name) doc.name = name
        if (level) doc.level = level
        if (description) doc.description = description

        const result = await this.cachedData.updateItem<IRole>(id, doc)

        return result
    }

    public async deleteRole(id:string):Promise<IRole | null> {

        const result = await this.cachedData.deleteItem<IRole>(id)

        return result
    }
}

export default new RoleController()