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

    public isLTValid(user:IUser, lt:string):boolean {
        let ltData:ILimitedTransaction|undefined

        // get limited transaction
        user.limitedTransactions.forEach(item => {
            if (item.type === lt && !item.disabled) {
                ltData = item
            }
        })

        // checker if no lt exist
        // checker if lt is disabled
        if (ltData && !Boolean(ltData.disabled)) {
            // checker if attempts is higher than the limit
            if (ltData.limit < ltData.attempts) return false
            // time expiration checker, current time versus time in expTime
            if (ltData.expTime) {
                let currTime = moment()
                let ltTime = moment(ltData.expTime)
                // check time is valid
                // then check if curren time is greater than the ltTime
                if (ltTime.isValid() && currTime.isAfter(ltTime)) return false
            }
        }

        return true
    }

    public geActivePassword(user:IUser):IPassword|undefined {
        let result:IPassword|undefined

        user.passwords.forEach(item => {
            if (item.isActive) result = item
        })

        return result
    }

    public getLT(user:IUser, limitedTransac:string):ILimitedTransaction|undefined {
        let result:ILimitedTransaction|undefined

        user.limitedTransactions.forEach(item => {
            if (item.type === limitedTransac) result = item
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