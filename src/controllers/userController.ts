import DataCache from '../utilities/dataCache'
import UserModel, { IUser, IUserQuery } from '../dataSource/models/userModel'
import DataRequest, { IListOutput, IPgeInfo } from '../utilities/dataQuery'
// import Config from '../utilities/config'

// const env = Config.getEnv()

class UserController {
    public cachedData:DataCache
    public request:DataRequest

    constructor() {
        this.cachedData = new DataCache(UserModel, { stdTTL: 120, checkperiod: 120 })
        this.request = new DataRequest(UserModel)
    }

    public async getUser(query:IUserQuery):Promise<IUser|null> {
        if (!query._id) return null
        return await this.cachedData.getItem(query._id)
    }

    public async getAllUsers():Promise<IUser[]> {

        const result = await this.cachedData.getAllItems<IUser>()

        return result
    }

    public async getUsersByPage(query:IUserQuery = {}, pageInfo: IPgeInfo):Promise<IListOutput<IUser>> {

        const result = await this.request.getItemsByPage<IUser>(query, {}, {}, pageInfo)

        return result
    }

    public async saveUser(doc:IUser):Promise<IUser | null> {

        const result = await this.cachedData.createItem(doc)

        return result
    }

    public async updateUser(id:string, doc:IUser):Promise<IUser | null> {

        const result = await this.cachedData.updateItem<IUser>(id, doc)

        return result
    }

    public async deleteUser(id:string):Promise<string | null> {

        const result = await this.cachedData.deleteItem(id)

        return result
    }
}

export default new UserController()