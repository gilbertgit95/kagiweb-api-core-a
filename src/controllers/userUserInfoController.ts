import accountModel, { IAccount, IAccountInfo, TAccountInfoType } from '../dataSource/models/userModel'
import userController from './userController'
// import Config from '../utilities/config'

// const env = Config.getEnv()

class UserUserInfoController {
    public hasUserInfoKey(account:IAccount, userInfoKey:string):boolean {
        if (account && account.userInfos) {
            for (const info of account.userInfos) {
                if (info.key === userInfoKey) return true
            }
        }

        return false
    }

    public getUserInfoByKey(account:IAccount, userInfoKey:string):IAccountInfo|null {

        if (account && account.userInfos) {
            for (const info of account.userInfos) {
                if (info.key === userInfoKey) return info
            }
        }

        return null
    }

    public getUserInfoById(account:IAccount, accountInfoId:string):IAccountInfo|null {

        if (account && account.userInfos) {
            for (const info of account.userInfos) {
                if (info._id === accountInfoId) return info
            }
        }

        return null
    }

    public async getUserInfo(accountId:string, accountInfoId:string):Promise<IAccountInfo|null> {
        if (!(accountId && accountInfoId)) throw({code: 400})

        const account = await userController.getUser({_id: accountId})
        if (!account) throw({code: 404})

        const accountInfo = this.getUserInfoById(account, accountInfoId)
        if (!accountInfo) throw({code: 404})

        return accountInfo
    }

    public async getUserInfos(accountId:string):Promise<IAccountInfo[]> {
        let result:IAccountInfo[] = []
        if (!accountId) throw({code: 400})

        const account = await userController.getUser({_id: accountId})
        if (!account) throw({code: 404})
        result = account!.userInfos? account!.userInfos: []

        return result
    }

    public async saveUserInfo(accountId:string, key:string, value:string, type:string):Promise<IAccountInfo|null> {
        if (!(accountId && key && value && type)) throw({code: 400})

        const account = await accountModel.findOne({_id: accountId})
        if (!account) throw({code: 404})

        // check if the account info to save is existing on the account account infos
        if (this.hasUserInfoKey(account, key)) throw({code: 409})

        account.userInfos!.push({key, value, type})

        await account.save()
        await userController.cachedData.removeCacheData(accountId)

        return this.getUserInfoByKey(account, key)
    }

    public async updateUserInfo(accountId:string, accountInfoId:string, key:string, value:string, type:TAccountInfoType):Promise<IAccountInfo|null> {
        if (!(accountId && accountInfoId)) throw({code: 400})

        const account = await accountModel.findOne({_id: accountId})
        if (!account) throw({code: 404})
        if (!account.userInfos?.id(accountInfoId)) throw({code: 404})

        if (key) account.userInfos!.id(accountInfoId)!.key = key
        if (value) account.userInfos!.id(accountInfoId)!.value = value
        if (type) account.userInfos!.id(accountInfoId)!.type = type

        await account.save()
        await userController.cachedData.removeCacheData(accountId)

        return account.userInfos!.id(accountInfoId)
    }

    public async deleteUserInfo(accountId:string, accountInfoId:string):Promise<IAccountInfo|null> {
        if (!(accountId && accountInfoId)) throw({code: 400})

        const account = await accountModel.findOne({_id: accountId})
        if (!account) throw({code: 404})

        const accountInfoData = account!.userInfos?.id(accountInfoId)
        if (accountInfoData) {
            account!.userInfos?.id(accountInfoId)?.deleteOne()
            await account.save()
            await userController.cachedData.removeCacheData(accountId)
        } else {
            throw({code: 404})
        }

        return accountInfoData? accountInfoData: null
    }
}

export default new UserUserInfoController()