import UserModel, { IUser,IAccessToken } from '../dataSource/models/userModel'
import userController from './userController'
import userClientDeviceController from './userClientDeviceController'
import DataCleaner from '../utilities/dataCleaner'
import Encryption from '../utilities/encryption'
// import Config from '../utilities/config'

// const env = Config.getEnv()

class UserClientDeviceAccessTokenController {
    public async removeInvalidTokens(userId:string) {
        const user = await UserModel.findOne({_id: userId})
        if (user) {
            let hasChanges = false
            // loop to every client devices
            for (const cDevice of user.clientDevices) {
                const clientDeviceId = cDevice._id
                // then loop to all client device token
                for (const token of cDevice.accessTokens? cDevice.accessTokens: []) {
                    const accessTokenId = token._id
                    // check token validity
                    if (!await Encryption.verifyJWT(token.jwt)) {
                        hasChanges = true
                        user.clientDevices!.id(clientDeviceId)!.accessTokens!.id(accessTokenId)?.deleteOne()
                    }
                }
            }

            if (hasChanges) {
                await user.save()
                await userController.cachedData.removeCacheData(userId)
            }
        }
    }

    public hasClientDeviceAccessTokenJWT(user:IUser, clientDeviceId:string, jwt:string):boolean {
        const clientDevice = userClientDeviceController.getClientDeviceById(user, clientDeviceId)
        // check client devices if existed
        if (clientDevice && clientDevice.accessTokens) {
            // then loop to all access token of the client device
            for (const accessToken of clientDevice.accessTokens) {
                // if the jwt we are looking matches with an entry
                // in the client device access tokens, just return true
                if (accessToken.jwt === jwt) return true
            }
        }

        return false
    }

    public getClientDeviceAccessTokenByJWT(user:IUser, clientDeviceId:string, jwt:string):IAccessToken|null {

        const clientDevice = userClientDeviceController.getClientDeviceById(user, clientDeviceId)
        // check client devices if existed
        if (clientDevice && clientDevice.accessTokens) {
            // then loop to all access token of the client device
            for (const accessToken of clientDevice.accessTokens) {
                // if the jwt we are looking matches with an entry
                // in the client device access tokens, just return true
                if (accessToken.jwt === jwt) return accessToken
            }
        }

        return null
    }

    public getClientDeviceAccessTokenById(user:IUser, clientDeviceId:string, accessTokenId:string):IAccessToken|null {

        const clientDevice = userClientDeviceController.getClientDeviceById(user, clientDeviceId)
        // check client devices if existed
        if (clientDevice && clientDevice.accessTokens) {
            // then loop to all access token of the client device
            for (const accessToken of clientDevice.accessTokens) {
                // if the jwt we are looking matches with an entry
                // in the client device access tokens, just return true
                if (accessToken._id === accessTokenId) return accessToken
            }
        }

        return null
    }

    public async getClientDeviceAccessToken(userId:string, clientDeviceId:string, accessTokenId:string):Promise<IAccessToken|null> {
        if (!(userId && clientDeviceId && accessTokenId)) throw({code: 400})

        const user = await userController.getUser({_id: userId})
        if (!user) throw({code: 404})

        const accessToken = this.getClientDeviceAccessTokenById(user, clientDeviceId, accessTokenId)
        if (!accessToken) throw({code: 404})

        return accessToken
    }

    public async getClientDeviceAccessTokens(userId:string, clientDeviceId:string):Promise<IAccessToken[]> {
        if (!userId) throw({code: 400})

        const user = await userController.getUser({_id: userId})
        if (!user) throw({code: 404})

        const clientDevice = userClientDeviceController.getClientDeviceById(user, clientDeviceId)

        return clientDevice && clientDevice.accessTokens? clientDevice.accessTokens: []
    }

    public async saveClientDeviceAccessToken(userId:string, clientDeviceId:string, jwt:string, ipAddress:string, disabled:boolean|string):Promise<IAccessToken|null> {
        if (!(userId && clientDeviceId && jwt)) throw({code: 400})

        const user = await UserModel.findOne({_id: userId})
        if (!user) throw({code: 404})

        // check if the user info to save is existing on the user user infos
        if (this.hasClientDeviceAccessTokenJWT(user, clientDeviceId, jwt)) throw({code: 409})

        const doc:{jwt?:string, ipAddress?:string, disabled?:boolean} = {jwt}
        if (ipAddress) doc.ipAddress = ipAddress
        if (DataCleaner.getBooleanData(disabled).isValid) {
            doc.disabled = DataCleaner.getBooleanData(disabled).data
        }
        user.clientDevices!.id(clientDeviceId)?.accessTokens?.push(doc)

        await user.save()
        await userController.cachedData.removeCacheData(userId)

        return this.getClientDeviceAccessTokenByJWT(user, clientDeviceId, jwt)
    }

    public async updateClientDeviceAccessToken(userId:string, clientDeviceId:string, accessTokenId:string, jwt:string, ipAddress:string, disabled:boolean|string):Promise<IAccessToken|null> {
        if (!(userId && clientDeviceId)) throw({code: 400})

        const user = await UserModel.findOne({_id: userId})
        if (!user) throw({code: 404})
        if (!this.getClientDeviceAccessTokenById(user, clientDeviceId, accessTokenId)) throw({code: 404})

        // check if client device ua already existed on other entries in this user client devices
        if (this.hasClientDeviceAccessTokenJWT(user, clientDeviceId, jwt)) throw({code: 409})

        if (jwt) user.clientDevices!.id(clientDeviceId)!.accessTokens!.id(accessTokenId)!.jwt =  jwt
        if (ipAddress) user.clientDevices!.id(clientDeviceId)!.accessTokens!.id(accessTokenId)!.ipAddress = ipAddress
        if (DataCleaner.getBooleanData(disabled).isValid) {
            user.clientDevices!.id(clientDeviceId)!.accessTokens!.id(accessTokenId)!.disabled = DataCleaner.getBooleanData(disabled).data
        }

        await user.save()
        await userController.cachedData.removeCacheData(userId)

        return user.clientDevices!.id(clientDeviceId)!.accessTokens!.id(accessTokenId)
    }

    public async deleteClientDeviceAccessToken(userId:string, clientDeviceId:string, accessTokenId:string):Promise<IAccessToken|null> {
        if (!(userId && clientDeviceId)) throw({code: 400})

        const user = await UserModel.findOne({_id: userId})
        if (!user) throw({code: 404})

        const accessTokenData = this.getClientDeviceAccessTokenById(user, clientDeviceId, accessTokenId)
        if (accessTokenData) {
            user.clientDevices!.id(clientDeviceId)!.accessTokens!.id(accessTokenId)?.deleteOne()
            await user.save()
            await userController.cachedData.removeCacheData(userId)
        } else {
            throw({code: 404})
        }

        return accessTokenData? accessTokenData: null
    }
}

export default new UserClientDeviceAccessTokenController()