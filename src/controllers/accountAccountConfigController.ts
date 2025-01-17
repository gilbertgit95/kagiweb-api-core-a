import accountModel, { IAccount, IAccountConfig, TAccountConfigType } from '../dataSource/models/accountModel'
import accountController from './accountController'
// import Config from '../utilities/config'

// const env = Config.getEnv()

class AccountAccountConfigController {
    public hasAccountConfigKey(account:IAccount, accountConfigKey:string):boolean {
        if (account && account.accountConfigs) {
            for (const config of account.accountConfigs) {
                if (config.key === accountConfigKey) return true
            }
        }

        return false
    }

    public getAccountConfigByKey(account:IAccount, accountConfigKey:string):IAccountConfig|null {

        if (account && account.accountConfigs) {
            for (const config of account.accountConfigs) {
                if (config.key === accountConfigKey) return config
            }
        }

        return null
    }

    public getAccountConfigById(account:IAccount, accountConfigId:string):IAccountConfig|null {

        if (account && account.accountConfigs) {
            for (const config of account.accountConfigs) {
                if (config._id === accountConfigId) return config
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

    public async updateAccountConfig(accountId:string, accountConfigId:string, value:string):Promise<IAccountConfig|null> {
        if (!(accountId && accountConfigId)) throw({code: 400})

        const account = await accountModel.findOne({_id: accountId})
        if (!account) throw({code: 404})
        if (!account.accountConfigs?.id(accountConfigId)) throw({code: 404})

        if (value) account.accountConfigs!.id(accountConfigId)!.value = value

        await account.save()
        await accountController.cachedData.removeCacheData(accountId)

        return account.accountConfigs!.id(accountConfigId)
    }

}

export default new AccountAccountConfigController()