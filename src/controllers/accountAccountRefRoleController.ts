import accountModel, { IAccount, IRoleRef } from '../dataSource/models/accountModel'
import accountController from './accountController'
import roleController from './roleController'
import accountAccountRefController from './accountAccountRefController'
import featureController from './featureController'
// import { IFeature } from '../dataSource/models/featureModel'
import { IRole } from '../dataSource/models/roleModel' 
import { IAccessInfo } from './accountController'
// import accountAccountConfigController from './accountAccountConfigController'
import accountAccountRefAcountConfigController from './accountAccountRefAcountConfigController'

// import DataCleaner from '../utilities/dataCleaner'
// import Config from '../utilities/config'

// const env = Config.getEnv()

class AccountAccountRefRoleController {
    public hasRole(account:IAccount, accountRefId:string, roleId:string):boolean {
        const accRef = accountAccountRefController.getAccountRefById(account, accountRefId)
        if (accRef && accRef.rolesRefs) {
            for (const ref of accRef.rolesRefs) {
                if (ref.roleId === roleId) return true
            }
        }

        return false
    }

    public getRoleRefByRoleId(account:IAccount, accountRefId:string, roleId:string):IRoleRef|null {
        const accRef = accountAccountRefController.getAccountRefById(account, accountRefId)
        if (accRef && accRef.rolesRefs) {
            for (const ref of accRef.rolesRefs) {
                if (ref.roleId === roleId) return ref
            }
        }

        return null
    }

    public async getRoleRefByRefId(account:IAccount, accountRefId:string, roleRefId:string):Promise<IRoleRef|null> {
        const accRef = accountAccountRefController.getAccountRefById(account, accountRefId)
        if (accRef && accRef.rolesRefs) {
            for (const ref of accRef.rolesRefs) {
                if (ref._id === roleRefId) return ref
            }
        }

        return null
    }

    public async getRoleRef(accountId:string, accountRefId:string, roleRefId:string):Promise<IRoleRef|null> {
        if (!(accountId && accountRefId && roleRefId)) throw({code: 400})

        const account = await accountController.getAccount({_id: accountId})
        if (!account) throw({code: 404})

        const roleRef = this.getRoleRefByRefId(account, accountRefId, roleRefId)
        if (!roleRef) throw({code: 404})

        return roleRef
    }

    public async getRoleRefs(accountId:string, accountRefId:string):Promise<IRoleRef[]> {
        if (!accountId && accountRefId) throw({code: 400})

        const account = await accountController.getAccount({_id: accountId})
        if (!account) throw({code: 404})

        const accRef = accountAccountRefController.getAccountRefById(account, accountRefId)
        
        return accRef!.rolesRefs? accRef!.rolesRefs: []
    }

    public async getDefaultMappedRoleRef(accountId:string, accountRefAccountId:string):Promise<IAccessInfo> {
        if (!(accountId && accountRefAccountId)) throw({code: 400})
        
        const account = await accountController.getAccount({_id: accountId})
        if (!account) throw({code: 404})

        const accountRef = accountAccountRefController.getAccountRefByAccountId(account, accountRefAccountId)
        if (!accountRef) throw({code: 404})

        // get default account ref
        const configRole = accountAccountRefAcountConfigController.getAccountConfigByKey(account, accountRef._id!, 'default-role')
        if (!configRole) throw({code: 404})

        const defaultAccountRole:IRole | null = await roleController.getMappedRole(configRole.value)
        if (!defaultAccountRole) throw({code: 404})

        // map role feature refs to the real features
        const featuresMap = await featureController.getFeaturesMap()

        if (!defaultAccountRole) throw({code: 404})

        // return {...defaultAccountRole, ...{accountFeatures: defaultAccountRole.featuresRefs?.map(item => featuresMap[item.featureId]) || []}}
        return {
            visitedAccount: account,
            visitedAccountRole: defaultAccountRole,
            visitedAccountFeatures: defaultAccountRole.featuresRefs?.map(item => featuresMap[item.featureId]) || [],
        }
    }

    public async saveRoleRef(accountId:string, accountRefId:string, roleId:string):Promise<IRoleRef|null> {

        if (!(accountId && accountRefId && roleId)) throw({code: 400})
        const account = await accountModel.findOne({_id: accountId})
        if (!account) throw({code: 404})
        const rolesMap = await roleController.getRolesMap()
        // check if role existed on roles collection
        if (!rolesMap[roleId]) throw({code: 404})
        // check if the role to update is existing on the account role refs
        if (this.hasRole(account, accountRefId, roleId)) throw({code: 409})
        const doc:{roleId:string} = {roleId}

        account.accountRefs?.id(accountRefId)?.rolesRefs?.push(doc)

        await account.save()
        await accountController.cachedData.removeCacheData(accountId)

        return this.getRoleRefByRoleId(account, accountRefId, roleId)
    }

    public async updateRoleRef(accountId:string, accountRefId:string, roleRefId:string, roleId:string|undefined):Promise<IRoleRef|null> {
        if (!(accountId && accountRefId && roleRefId && roleId)) throw({code: 400})

        const account = await accountModel.findOne({_id: accountId})
        if (!account) throw({code: 404})
        if (!account.accountRefs?.id(accountRefId)?.rolesRefs?.id(roleRefId)) throw({code: 404})

        if (roleId) {
            const rolesMap = await roleController.getRolesMap()
            // check if role existed on roles collection
            if (!rolesMap[roleId]) throw({code: 404})

            // check if the role to update is existing on the role roles refs
            if (this.hasRole(account, accountRefId, roleId)) throw({code: 409})

            account.accountRefs!.id(accountRefId)!.rolesRefs!.id(roleRefId)!.roleId = roleId
        }

        await account.save()
        await accountController.cachedData.removeCacheData(accountId)

        return this.getRoleRefByRoleId(account, accountRefId, roleId)
    }

    public async deleteRoleRef(accountId:string, accountRefId:string, roleRefId:string):Promise<IRoleRef|null> {
        if (!(accountId && accountRefId && roleRefId)) throw({code: 400})

        const account = await accountModel.findOne({_id: accountId})
        if (!account) throw({code: 404})

        const accRef = accountAccountRefController.getAccountRefById(account, accountRefId)
        // if account has only one role, then do not delete the role
        if (!accRef) throw({code: 404})
        if (accRef?.rolesRefs && accRef.rolesRefs.length <= 1) throw({code: 409})

        const roleRefData = account.accountRefs!.id(accountRefId)!.rolesRefs!.id(roleRefId)
        if (roleRefData) {
            account.accountRefs!.id(accountRefId)!.rolesRefs!.id(roleRefId)?.deleteOne()
            await account.save()
            await accountController.cachedData.removeCacheData(accountId)
        } else {
            throw({code: 404})
        }

        return roleRefData? roleRefData: null
    }
}

export default new AccountAccountRefRoleController()