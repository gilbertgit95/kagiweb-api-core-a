import accountModel, { IAccount, IAccountConfig, TAccountConfigType } from '../dataSource/models/accountModel'
import accountController from './accountController'
// import Config from '../utilities/config'

// const env = Config.getEnv()

class AccountAccountConfigController {
    public hasAccountConfigKey(account:IAccount, accountConfigKey:string):boolean {
        if (account && account.accountConfigs) {
            for (const info of account.accountConfigs) {
                if (info.key === accountConfigKey) return true
            }
        }

        return false
    }

    public getAccountConfigByKey(account:IAccount, accountConfigKey:string):IAccountConfig|null {

        if (account && account.accountConfigs) {
            for (const info of account.accountConfigs) {
                if (info.key === accountConfigKey) return info
            }
        }

        return null
    }

    public getAccountConfigById(account:IAccount, accountConfigId:string):IAccountConfig|null {

        if (account && account.accountConfigs) {
            for (const info of account.accountConfigs) {
                if (info._id === accountConfigId) return info
            }
        }

        return null
    }

    public async getAccountConfig(accountId:string, accountConfigId:string):Promise<IAccountConfig|null> {
        if (!(accountId && accountConfigId)) throw({code: 400})

        const account = await accountController.getAccount({_id: accountId})
        if (!account) throw({code: 404})

        const accountConfig = this.getAccountConfigById(account, accountConfigId)
        if (!accountConfig) throw({code: 404})

        return accountConfig
    }

    public async getAccountConfigs(accountId:string):Promise<IAccountConfig[]> {
        let result:IAccountConfig[] = []
        if (!accountId) throw({code: 400})

        const account = await accountController.getAccount({_id: accountId})
        if (!account) throw({code: 404})
        result = account!.accountConfigs? account!.accountConfigs: []

        return result
    }

    public async updateAccountConfig(accountId:string, accountConfigId:string, key:string, value:string, type:TAccountConfigType):Promise<IAccountConfig|null> {
        if (!(accountId && accountConfigId)) throw({code: 400})

        const account = await accountModel.findOne({_id: accountId})
        if (!account) throw({code: 404})
        if (!account.accountConfigs?.id(accountConfigId)) throw({code: 404})

        if (key) account.accountConfigs!.id(accountConfigId)!.key = key
        if (value) account.accountConfigs!.id(accountConfigId)!.value = value
        if (type) account.accountConfigs!.id(accountConfigId)!.type = type

        await account.save()
        await accountController.cachedData.removeCacheData(accountId)

        return account.accountConfigs!.id(accountConfigId)
    }

}

export default new AccountAccountConfigController()