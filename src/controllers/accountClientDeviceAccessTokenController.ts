import accountModel, { IAccount,IAccessToken } from '../dataSource/models/accountModel'
import userController from './accountController'
import userClientDeviceController from './accountClientDeviceController'
import DataCleaner from '../utilities/dataCleaner'
import Encryption from '../utilities/encryption'
// import Config from '../utilities/config'

// const env = Config.getEnv()

class UserClientDeviceAccessTokenController {
    public async removeInvalidTokens(accountId:string) {
        const account = await accountModel.findOne({_id: accountId})
        if (account) {
            let hasChanges = false
            // loop to every client devices
            for (const cDevice of account.clientDevices) {
                const clientDeviceId = cDevice._id
                // then loop to all client device token
                for (const token of cDevice.accessTokens? cDevice.accessTokens: []) {
                    const accessTokenId = token._id
                    // check token validity
                    if (!await Encryption.verifyJWT(token.jwt)) {
                        hasChanges = true
                        account.clientDevices!.id(clientDeviceId)!.accessTokens!.id(accessTokenId)?.deleteOne()
                    }
                }
            }

            if (hasChanges) {
                await account.save()
                await userController.cachedData.removeCacheData(accountId)
            }
        }
    }

    public hasClientDeviceAccessTokenJWT(account:IAccount, clientDeviceId:string, jwt:string):boolean {
        const clientDevice = userClientDeviceController.getClientDeviceById(account, clientDeviceId)
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

    public getClientDeviceAccessTokenByJWT(account:IAccount, clientDeviceId:string, jwt:string):IAccessToken|null {

        const clientDevice = userClientDeviceController.getClientDeviceById(account, clientDeviceId)
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

    public getClientDeviceAccessTokenById(account:IAccount, clientDeviceId:string, accessTokenId:string):IAccessToken|null {

        const clientDevice = userClientDeviceController.getClientDeviceById(account, clientDeviceId)
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

    public async getClientDeviceAccessToken(accountId:string, clientDeviceId:string, accessTokenId:string):Promise<IAccessToken|null> {
        if (!(accountId && clientDeviceId && accessTokenId)) throw({code: 400})

        const account = await userController.getUser({_id: accountId})
        if (!account) throw({code: 404})

        const accessToken = this.getClientDeviceAccessTokenById(account, clientDeviceId, accessTokenId)
        if (!accessToken) throw({code: 404})

        return accessToken
    }

    public async getClientDeviceAccessTokens(accountId:string, clientDeviceId:string):Promise<IAccessToken[]> {
        if (!accountId) throw({code: 400})

        const account = await userController.getUser({_id: accountId})
        if (!account) throw({code: 404})

        const clientDevice = userClientDeviceController.getClientDeviceById(account, clientDeviceId)

        return clientDevice && clientDevice.accessTokens? clientDevice.accessTokens: []
    }

    public async saveClientDeviceAccessToken(accountId:string, clientDeviceId:string, expiration:number|undefined, description:string, ipAddress:string, disabled:boolean|string):Promise<IAccessToken|null> {
        if (!(accountId && clientDeviceId)) throw({code: 400})

        const account = await accountModel.findOne({_id: accountId})
        if (!account) throw({code: 404})
        const jwtStr = Encryption.generateJWT({accountId}, expiration)
        const exp = (await Encryption.verifyJWT<{accountId:string}>(jwtStr))?.exp
        const expTime = exp? new Date(exp * 1e3): undefined

        const doc:{jwt:string, expTime?:Date, ipAddress?:string, description?:string, disabled?:boolean} = {jwt:jwtStr}
        if (description) doc.description = description
        if (ipAddress) doc.ipAddress = ipAddress
        if (expTime) doc.expTime = expTime
        if (DataCleaner.getBooleanData(disabled).isValid) {
            doc.disabled = DataCleaner.getBooleanData(disabled).data
        }
        account.clientDevices!.id(clientDeviceId)?.accessTokens?.push(doc)

        await account.save()
        await userController.cachedData.removeCacheData(accountId)

        return this.getClientDeviceAccessTokenByJWT(account, clientDeviceId, jwtStr)
    }

    public async updateClientDeviceAccessToken(accountId:string, clientDeviceId:string, accessTokenId:string, description:string, ipAddress:string, disabled:boolean|string):Promise<IAccessToken|null> {
        if (!(accountId && clientDeviceId)) throw({code: 400})

        const account = await accountModel.findOne({_id: accountId})
        if (!account) throw({code: 404})
        if (!this.getClientDeviceAccessTokenById(account, clientDeviceId, accessTokenId)) throw({code: 404})

        if (description) account.clientDevices!.id(clientDeviceId)!.accessTokens!.id(accessTokenId)!.description =  description
        if (ipAddress) account.clientDevices!.id(clientDeviceId)!.accessTokens!.id(accessTokenId)!.ipAddress = ipAddress
        if (DataCleaner.getBooleanData(disabled).isValid) {
            account.clientDevices!.id(clientDeviceId)!.accessTokens!.id(accessTokenId)!.disabled = DataCleaner.getBooleanData(disabled).data
        }

        await account.save()
        await userController.cachedData.removeCacheData(accountId)

        return account.clientDevices!.id(clientDeviceId)!.accessTokens!.id(accessTokenId)
    }

    public async deleteClientDeviceAccessToken(accountId:string, clientDeviceId:string, accessTokenId:string):Promise<IAccessToken|null> {
        if (!(accountId && clientDeviceId)) throw({code: 400})

        const account = await accountModel.findOne({_id: accountId})
        if (!account) throw({code: 404})

        const accessTokenData = this.getClientDeviceAccessTokenById(account, clientDeviceId, accessTokenId)
        if (accessTokenData) {
            account.clientDevices!.id(clientDeviceId)!.accessTokens!.id(accessTokenId)?.deleteOne()
            await account.save()
            await userController.cachedData.removeCacheData(accountId)
        } else {
            throw({code: 404})
        }

        return accessTokenData? accessTokenData: null
    }
}

export default new UserClientDeviceAccessTokenController()