import DataCache from '../utilities/dataCache'
import UserModel, { IUser, IUserQuery } from '../dataSource/models/userModel'
import DataRequest, { IListOutput, IPgeInfo } from '../utilities/dataQuery'
// import Config from '../utilities/config'

// const env = Config.getEnv()

// querying
// const doc = order.lineItems.id(`6277ddade65b3236b1eb65d6`)

// create
// order.lineItems.push({
//     name: 'T-shirt',
//     price: 6,
//     qty: 2,
//     total: 12
// })

// update
// order.lineItems.id(id).qty = 3

// delete
// order.lineItems.id(`6277ddade65b3236b1eb65d6`).remove()
// const updated = await order.save()

class UserController {
    public cachedData:DataCache
    public request:DataRequest

    constructor() {
        this.cachedData = new DataCache(UserModel, { stdTTL: 30, checkperiod: 15 })
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

    public async updateUser(id:string, doc:any):Promise<IUser | null> { // eslint-disable-line @typescript-eslint/no-explicit-any

        const result = await this.cachedData.updateItem<IUser>(id, doc)

        return result
    }

    public async deleteUser(id:string):Promise<IUser | null> {

        const result = await this.cachedData.deleteItem<IUser>(id)

        return result
    }
}

export default new UserController()