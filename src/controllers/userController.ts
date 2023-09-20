import moment from 'moment'

import DataCache from '../utilities/dataCache'
import UserModel, { IUser, IUserQuery, IClientDevice, ILimitedTransaction, IAccessToken, IPassword } from '../dataSource/models/userModel'
import DataRequest, { IListOutput, IPgeInfo } from '../utilities/dataQuery'
import roleController from './roleController'

import Encryption from '../utilities/encryption'
import DataCleaner from '../utilities/dataCleaner'
// import Config from '../utilities/config'

// const env = Config.getEnv()

class UserController {
    public cachedData:DataCache
    public request:DataRequest

    constructor() {
        this.cachedData = new DataCache(UserModel, { stdTTL: 30, checkperiod: 15 })
        this.request = new DataRequest(UserModel)
    }

    public async getUser(query:IUserQuery):Promise<IUser|null> {
        if (!query._id) return null
        return await this.cachedData.getItem<IUser>(query._id)
    }

    public async getAllUsers():Promise<IUser[]> {
        return await this.cachedData.getAllItems<IUser>()
    }

    public async getUsersByPage(query:IUserQuery = {}, pageInfo: IPgeInfo):Promise<IListOutput<IUser>> {
        return await this.request.getItemsByPage<IUser>(query, {}, {}, pageInfo)
    }

    public async saveUser(username:string, disabled:boolean|string, verified:boolean|string):Promise<IUser | null> {
        // check username if already existing
        if (await UserModel.findOne({username})) throw({code: 409}) // conflict

        const role = await roleController.getLeastRole()
        const defautPass = '123456'

        const doc:any = {
            username, rolesRefs: role? [{roleId: role._id, isActive: true}]: [],
            userInfo: [],
            passwords: [
                { key: await Encryption.hashText(defautPass), isActive: true }
            ],
            contactInfos: [],
            clientDevices: [],
            limitedTransactions: [
                { limit: 5, type: 'signin' },
                { limit: 5, type: 'otp-signin', disabled: true },
                { limit: 5, type: 'forgot-pass' },
                { limit: 5, type: 'reset-pass' },
                { limit: 5, type: 'verify-contact'}
            ]
        }

        if (DataCleaner.getBooleanData(disabled).isValid) {
            doc.disabled = DataCleaner.getBooleanData(disabled).data
        }
        if (DataCleaner.getBooleanData(verified).isValid) {
            doc.verified = DataCleaner.getBooleanData(verified).data
        }

        return await this.cachedData.createItem<IUser>(doc)
    }

    public async updateUser(id:string, username:string, disabled:boolean|string, verified:boolean|string):Promise<IUser | null> { // eslint-disable-line @typescript-eslint/no-explicit-any
        const doc:any = {}
        if (!id) return null
        // check username if already existing
        if (typeof username === 'string' && username.length) {
            if (await UserModel.findOne({username})) throw({code: 409}) // conflict
            doc.username = username
        }
        if (DataCleaner.getBooleanData(disabled).isValid) {
            doc.disabled = DataCleaner.getBooleanData(disabled).data
        }
        if (DataCleaner.getBooleanData(verified).isValid) {
            doc.verified = DataCleaner.getBooleanData(verified).data
        }

        return await this.cachedData.updateItem<IUser>(id, doc)
    }

    public async deleteUser(id:string):Promise<IUser | null> {
        return await this.cachedData.deleteItem<IUser>(id)
    }
}

export default new UserController()