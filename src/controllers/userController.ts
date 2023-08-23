import moment from 'moment'

import DataCache from '../utilities/dataCache'
import UserModel, { IUser, IUserQuery, IClientDevice, ILimitedTransaction, IAccessToken } from '../dataSource/models/userModel'
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

    public isLimitedTransactionValid(user:IUser, lt:string):boolean {
        let ltData:ILimitedTransaction|undefined

        // get limited transaction
        user.limitedTransactions.forEach(item => {
            if (item.type === lt && !item.disabled) {
                ltData = item
            }
        })

        // checker if no lt exist
        if (!ltData) return false
        // checker if lt is disabled
        if (ltData.disabled) return false
        // checker if attempts is higher than the limit
        if (ltData.limit < ltData.attempts) return false
        // time expiration checker, current time versus time in expTime
        if (ltData.expTime) {
            let currTime = moment()
            let ltTime = moment(ltData.expTime)
            // check time is valid
            // then check if curren time is greater than the ltTime
            // if (inValid || curr > lt) return false
        }

        return true
    }

    public getLimitedTransaction(user:IUser, limitedTransac:string):ILimitedTransaction|undefined {
        let result:ILimitedTransaction|undefined

        user.limitedTransactions.forEach(item => {
            if (item.type === limitedTransac && !item.disabled) {
                result = item
            }
        })

        return result
    }

    public getDevice(user:IUser, device:IClientDevice):IClientDevice|undefined {
        let result:IClientDevice|undefined

        user.clientDevices.forEach(cDevice => {
            if (cDevice.ua === device.ua) result = cDevice
        })

        return result
    }
    public getToken(device:IClientDevice|null, token:string):IAccessToken|undefined {
        let result:IAccessToken|undefined

        if (!device) return result

        device.accessTokens?.forEach(item => {
            if (item.jwt === token) result = item
        })

        return result
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