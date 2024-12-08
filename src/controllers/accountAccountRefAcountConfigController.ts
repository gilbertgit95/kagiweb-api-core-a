import accountModel, { IAccount, IAccountConfig, TAccountConfigType } from '../dataSource/models/accountModel'
import accountController from './accountController'
import accountWorkspaceAccountRefController from './accountWorkspaceAccountRefController'

// import Config from '../utilities/config'

// const env = Config.getEnv()

class AccountWorkspaceAccountRefConfigController {
    public hasAccountConfigKey(account:IAccount, workspaceId:string, accountRefId:string, accountConfigKey:string):boolean {
        const accRef = accountWorkspaceAccountRefController.getWorkspaceAccountRefById(account, workspaceId, accountRefId)
        if (accRef && accRef.accountConfigs) {
            for (const config of accRef.accountConfigs) {
                if (config.key === accountConfigKey) return true
            }
        }

        return false
    }

    public getAccountConfigByKey(account:IAccount, workspaceId:string, accountRefId:string, accountConfigKey:string):IAccountConfig|null {
        const accRef = accountWorkspaceAccountRefController.getWorkspaceAccountRefById(account, workspaceId, accountRefId)
        if (accRef && accRef.accountConfigs) {
            for (const config of accRef.accountConfigs) {
                if (config.key === accountConfigKey) return config
            }
        }

        return null
    }

    public getAccountConfigById(account:IAccount, workspaceId:string, accountRefId:string, accountConfigId:string):IAccountConfig|null {
        const accRef = accountWorkspaceAccountRefController.getWorkspaceAccountRefById(account, workspaceId, accountRefId)
        if (accRef && accRef.accountConfigs) {
            for (const config of accRef.accountConfigs) {
                if (config._id === accountConfigId) return config
            }
        }

        return null
    }

    public async getAccountConfig(accountId:string, workspaceId:string, accountRefId:string, accountConfigId:string):Promise<IAccountConfig|null> {
        if (!(accountId && workspaceId && accountRefId && accountConfigId)) throw({code: 400})

        const account = await accountController.getAccount({_id: accountId})
        if (!account) throw({code: 404})

        const accountConfig = this.getAccountConfigById(account, workspaceId, accountRefId, accountConfigId)
        if (!accountConfig) throw({code: 404})

        return accountConfig
    }

    public async getAccountConfigs(accountId:string, workspaceId:string, accountRefId:string):Promise<IAccountConfig[]> {
        if (!accountId && workspaceId && accountRefId) throw({code: 400})

        const account = await accountController.getAccount({_id: accountId})
        if (!account) throw({code: 404})

        const accRef = accountWorkspaceAccountRefController.getWorkspaceAccountRefById(account, workspaceId, accountRefId)

        return accRef!.accountConfigs? accRef!.accountConfigs: []
    }

    public async updateAccountConfig(accountId:string, workspaceId:string, accountRefId:string, accountConfigId:string, value:string):Promise<IAccountConfig|null> {
        if (!(accountId && workspaceId && accountRefId && accountConfigId)) throw({code: 400})

        const account = await accountModel.findOne({_id: accountId})

        if (!account) throw({code: 404})

        if (!account.workspaces.id(workspaceId)?.accountRefs?.id(accountRefId)?.accountConfigs?.id(accountConfigId)) throw({code: 404})

        if (value) account.workspaces.id(workspaceId)!.accountRefs!.id(accountRefId)!.accountConfigs!.id(accountConfigId)!.value = value

        await account.save()
        await accountController.cachedData.removeCacheData(accountId)

        // return account.accountConfigs!.id(accountConfigId)
        return this.getAccountConfigById(account, workspaceId, accountRefId, accountConfigId)
    }

}

export default new AccountWorkspaceAccountRefConfigController()