import UAParser, {IResult}  from 'ua-parser-js'
import accountModel, { IAccount, IClientDevice } from '../dataSource/models/accountModel'
import userController from './accountController'
import DataCleaner from '../utilities/dataCleaner'
// import Config from '../utilities/config'

// const env = Config.getEnv()

class UserClientDeviceController {
    public hasClientDeviceUA(account:IAccount, ua:string):boolean {
        if (account && account.clientDevices) {
            for (const clientDevice of account.clientDevices) {
                if (clientDevice.ua === ua) return true
            }
        }

        return false
    }

    public getClientDeviceByUA(account:IAccount, ua:string):IClientDevice|null {

        if (account && account.clientDevices) {
            for (const clientDevice of account.clientDevices) {
                if (clientDevice.ua === ua) return clientDevice
            }
        }

        return null
    }

    public getClientDeviceById(account:IAccount, clientDeviceId:string):IClientDevice|null {

        if (account && account.clientDevices) {
            for (const clientDevice of account.clientDevices) {
                if (clientDevice._id === clientDeviceId) return clientDevice
            }
        }

        return null
    }

    public async getClientDevice(accountId:string, clientDeviceId:string):Promise<IClientDevice|null> {
        if (!(accountId && clientDeviceId)) throw({code: 400})

        const account = await userController.getUser({_id: accountId})
        if (!account) throw({code: 404})

        const clientDevice = this.getClientDeviceById(account, clientDeviceId)
        if (!clientDevice) throw({code: 404})

        return clientDevice
    }

    public async getClientDevices(accountId:string):Promise<IClientDevice[]> {
        let result:IClientDevice[] = []
        if (!accountId) throw({code: 400})

        const account = await userController.getUser({_id: accountId})
        if (!account) throw({code: 404})
        result = account!.clientDevices? account!.clientDevices: []

        return result
    }

    public async saveClientDevice(accountId:string, ua:string, description:string|undefined, disabled:boolean|string):Promise<IClientDevice|null> {
        if (!(accountId && ua)) throw({code: 400})

        const account = await accountModel.findOne({_id: accountId})
        if (!account) throw({code: 404})

        // check if the account info to save is existing on the account account infos
        if (this.hasClientDeviceUA(account, ua)) throw({code: 409})
        const doc:IResult & {disabled?:boolean, description?:string} = (new UAParser(ua)).getResult()
        if (description) {
            doc.description = description
        }
        if (DataCleaner.getBooleanData(disabled).isValid) {
            doc.disabled = DataCleaner.getBooleanData(disabled).data
        }
        account.clientDevices!.push(doc)

        await account.save()
        await userController.cachedData.removeCacheData(accountId)

        return this.getClientDeviceByUA(account, ua)
    }

    public async updateClientDevice(accountId:string, clientDeviceId:string, ua:string, description:string|undefined, disabled:boolean|string):Promise<IClientDevice|null> {
        if (!(accountId && clientDeviceId)) throw({code: 400})

        const account = await accountModel.findOne({_id: accountId})
        if (!account) throw({code: 404})
        if (!account.clientDevices?.id(clientDeviceId)) throw({code: 404})

        // check if client device ua already existed on other entries in this account client devices
        if (this.hasClientDeviceUA(account, ua)) throw({code: 409})

        if (ua) {
            account.clientDevices!.id(clientDeviceId)!.ua = ua
        }
        if (description) {
            account.clientDevices!.id(clientDeviceId)!.description = description
        }
        if (DataCleaner.getBooleanData(disabled).isValid) {
            account.clientDevices!.id(clientDeviceId)!.disabled = DataCleaner.getBooleanData(disabled).data
        }

        await account.save()
        await userController.cachedData.removeCacheData(accountId)

        return account.clientDevices!.id(clientDeviceId)
    }

    public async deleteClientDevice(accountId:string, clientDeviceId:string):Promise<IClientDevice|null> {
        if (!(accountId && clientDeviceId)) throw({code: 400})

        const account = await accountModel.findOne({_id: accountId})
        if (!account) throw({code: 404})

        const clientDeviceData = account!.clientDevices?.id(clientDeviceId)
        if (clientDeviceData) {
            account!.clientDevices?.id(clientDeviceId)?.deleteOne()
            await account.save()
            await userController.cachedData.removeCacheData(accountId)
        } else {
            throw({code: 404})
        }

        return clientDeviceData? clientDeviceData: null
    }
}

export default new UserClientDeviceController()