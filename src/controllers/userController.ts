import DataCache from '../utilities/dataCache'
import UserModel, { IUser } from '../dataSource/models/userModel'
import DataRequest, { IListOutput, IPgeInfo } from '../utilities/dataQuery'
import Config from '../utilities/config'

const env = Config.getEnv()

class UserController {
    public cachedData:DataCache
    public request:DataRequest

    constructor() {
        this.cachedData = new DataCache(UserModel, { stdTTL: 120, checkperiod: 120 })
        this.request = new DataRequest(UserModel)
    }

    public async getUser(query:any):Promise<IUser|null> {
        return await this.cachedData.getItem(query._id)
    }

    public async getAllUsers():Promise<IUser[]> {

        const result = await this.cachedData.getAllItems()

        return result
    }

    public async getUsersByPage(query:any = {}, pageInfo: IPgeInfo):Promise<IListOutput> {

        const result = await this.request.getItemsByPage(query, {}, {}, pageInfo)

        return result
    }

    public async saveUser(doc:IUser):Promise<IUser | null> {

        const result = await this.cachedData.createItem(doc)

        return result
    }

    public async updateUser(id:string, doc:any):Promise<IUser | null> {

        const result = await this.cachedData.updateItem(id, doc)

        return result
    }

    public async deleteUser(id:string):Promise<string | null> {

        const result = await this.cachedData.deleteItem(id)

        return result
    }
}

export default new UserController()