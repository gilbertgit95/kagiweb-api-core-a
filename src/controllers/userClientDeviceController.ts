import UAParser  from 'ua-parser-js'
import UserModel, { IUser, IClientDevice } from '../dataSource/models/userModel'
import userController from './userController'
import DataCleaner from '../utilities/dataCleaner'
// import Config from '../utilities/config'

// const env = Config.getEnv()

class UserClientDeviceController {
    public hasClientDeviceUA(user:IUser, ua:string):boolean {
        if (user && user.clientDevices) {
            for (const clientDevice of user.clientDevices) {
                if (clientDevice.ua === ua) return true
            }
        }

        return false
    }

    public getClientDeviceByUA(user:IUser, ua:string):IClientDevice|null {

        if (user && user.clientDevices) {
            for (const clientDevice of user.clientDevices) {
                if (clientDevice.ua === ua) return clientDevice
            }
        }

        return null
    }

    public getClientDeviceById(user:IUser, clientDeviceId:string):IClientDevice|null {

        if (user && user.clientDevices) {
            for (const clientDevice of user.clientDevices) {
                if (clientDevice._id === clientDeviceId) return clientDevice
            }
        }

        return null
    }

    public async getClientDevice(userId:string, clientDeviceId:string):Promise<IClientDevice|null> {
        if (!(userId && clientDeviceId)) throw({code: 400})

        const user = await userController.getUser({_id: userId})
        if (!user) throw({code: 404})

        const clientDevice = this.getClientDeviceById(user, clientDeviceId)
        if (!clientDevice) throw({code: 404})

        return clientDevice
    }

    public async getClientDevices(userId:string):Promise<IClientDevice[]> {
        let result:IClientDevice[] = []
        if (!userId) throw({code: 400})

        const user = await userController.getUser({_id: userId})
        if (!user) throw({code: 404})
        result = user!.clientDevices? user!.clientDevices: []

        return result
    }

    public async saveClientDevice(userId:string, ua:string, disabled:boolean|string):Promise<IClientDevice|null> {
        if (!(userId && ua)) throw({code: 400})

        const user = await UserModel.findOne({_id: userId})
        if (!user) throw({code: 404})

        // check if the user info to save is existing on the user user infos
        if (this.hasClientDeviceUA(user, ua)) throw({code: 409})
        const doc:any = (new UAParser(ua)).getResult()
        if (DataCleaner.getBooleanData(disabled).isValid) {
            doc.disabled = DataCleaner.getBooleanData(disabled).data
        }
        user.clientDevices!.push(doc)

        await user.save()
        await userController.cachedData.removeCacheData(userId)

        return this.getClientDeviceByUA(user, ua)
    }

    public async updateClientDevice(userId:string, clientDeviceId:string, ua:string, disabled:boolean|string):Promise<IClientDevice|null> {
        if (!(userId && clientDeviceId)) throw({code: 400})

        const user = await UserModel.findOne({_id: userId})
        if (!user) throw({code: 404})
        if (!user.clientDevices?.id(clientDeviceId)) throw({code: 404})

        // check if client device ua already existed on other entries in this user client devices
        if (this.hasClientDeviceUA(user, ua)) throw({code: 409})

        if (ua) {
            const doc = (new UAParser(ua)).getResult()

            user.clientDevices!.id(clientDeviceId)!.ua =      ua
            user.clientDevices!.id(clientDeviceId)!.browser = doc.browser
            user.clientDevices!.id(clientDeviceId)!.engine =  doc.engine
            user.clientDevices!.id(clientDeviceId)!.os =      doc.os
            user.clientDevices!.id(clientDeviceId)!.device =  doc.device
            user.clientDevices!.id(clientDeviceId)!.cpu =     doc.cpu
        }
        if (DataCleaner.getBooleanData(disabled).isValid) {
            user.clientDevices!.id(clientDeviceId)!.disabled = DataCleaner.getBooleanData(disabled).data
        }

        await user.save()
        await userController.cachedData.removeCacheData(userId)

        return user.clientDevices!.id(clientDeviceId)
    }

    public async deleteClientDevice(userId:string, clientDeviceId:string):Promise<IClientDevice|null> {
        if (!(userId && clientDeviceId)) throw({code: 400})

        const user = await UserModel.findOne({_id: userId})
        if (!user) throw({code: 404})

        const clientDeviceData = user!.clientDevices?.id(clientDeviceId)
        if (clientDeviceData) {
            user!.clientDevices?.id(clientDeviceId)?.deleteOne()
            await user.save()
            await userController.cachedData.removeCacheData(userId)
        } else {
            throw({code: 404})
        }

        return clientDeviceData? clientDeviceData: null
    }
}

export default new UserClientDeviceController()