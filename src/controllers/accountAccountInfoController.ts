import accountModel, { IAccount, IAccountInfo, TAccountInfoType } from '../dataSource/models/accountModel'
import userController from './accountController'
// import Config from '../utilities/config'

// const env = Config.getEnv()

class UserAccountInfoController {
    public hasAccountInfoKey(account:IAccount, accountInfoKey:string):boolean {
        if (account && account.accountInfos) {
            for (const info of account.accountInfos) {
                if (info.key === accountInfoKey) return true
            }
        }

        return false
    }

    public getAccountInfoByKey(account:IAccount, accountInfoKey:string):IAccountInfo|null {

        if (account && account.accountInfos) {
            for (const info of account.accountInfos) {
                if (info.key === accountInfoKey) return info
            }
        }

        return null
    }

    public getAccountInfoById(account:IAccount, accountInfoId:string):IAccountInfo|null {

        if (account && account.accountInfos) {
            for (const info of account.accountInfos) {
                if (info._id === accountInfoId) return info
            }
        }

        return null
    }

    public async getAccountInfo(accountId:string, accountInfoId:string):Promise<IAccountInfo|null> {
        if (!(accountId && accountInfoId)) throw({code: 400})

        const account = await userController.getUser({_id: accountId})
        if (!account) throw({code: 404})

        const accountInfo = this.getAccountInfoById(account, accountInfoId)
        if (!accountInfo) throw({code: 404})

        return accountInfo
    }

    public async getAccountInfos(accountId:string):Promise<IAccountInfo[]> {
        let result:IAccountInfo[] = []
        if (!accountId) throw({code: 400})

        const account = await userController.getUser({_id: accountId})
        if (!account) throw({code: 404})
        result = account!.accountInfos? account!.accountInfos: []

        return result
    }

    public async saveAccountInfo(accountId:string, key:string, value:string, type:string):Promise<IAccountInfo|null> {
        if (!(accountId && key && value && type)) throw({code: 400})

        const account = await accountModel.findOne({_id: accountId})
        if (!account) throw({code: 404})

        // check if the account info to save is existing on the account account infos
        if (this.hasAccountInfoKey(account, key)) throw({code: 409})

        account.accountInfos!.push({key, value, type})

        await account.save()
        await userController.cachedData.removeCacheData(accountId)

        return this.getAccountInfoByKey(account, key)
    }

    public async updateAccountInfo(accountId:string, accountInfoId:string, key:string, value:string, type:TAccountInfoType):Promise<IAccountInfo|null> {
        if (!(accountId && accountInfoId)) throw({code: 400})

        const account = await accountModel.findOne({_id: accountId})
        if (!account) throw({code: 404})
        if (!account.accountInfos?.id(accountInfoId)) throw({code: 404})

        if (key) account.accountInfos!.id(accountInfoId)!.key = key
        if (value) account.accountInfos!.id(accountInfoId)!.value = value
        if (type) account.accountInfos!.id(accountInfoId)!.type = type

        await account.save()
        await userController.cachedData.removeCacheData(accountId)

        return account.accountInfos!.id(accountInfoId)
    }

    public async deleteAccountInfo(accountId:string, accountInfoId:string):Promise<IAccountInfo|null> {
        if (!(accountId && accountInfoId)) throw({code: 400})

        const account = await accountModel.findOne({_id: accountId})
        if (!account) throw({code: 404})

        const accountInfoData = account!.accountInfos?.id(accountInfoId)
        if (accountInfoData) {
            account!.accountInfos?.id(accountInfoId)?.deleteOne()
            await account.save()
            await userController.cachedData.removeCacheData(accountId)
        } else {
            throw({code: 404})
        }

        return accountInfoData? accountInfoData: null
    }
}

export default new UserAccountInfoController()