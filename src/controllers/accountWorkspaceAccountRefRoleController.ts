import accountModel, { IAccount, IRoleRef } from '../dataSource/models/accountModel'
import accountWorkspaceAccountRefController from './accountWorkspaceAccountRefController'

import accountController from './accountController'
import roleController from './roleController'
import DataCleaner from '../utilities/dataCleaner'
// import Config from '../utilities/config'

// const env = Config.getEnv()

class AccountWorkspaceAccountRefRoleController {
    public hasRole(account:IAccount, workspaceId:string, accountRefId:string, roleId:string):boolean {
        const accRef = accountWorkspaceAccountRefController.getWorkspaceAccountRefById(account, workspaceId, accountRefId)
        if (accRef && accRef.rolesRefs) {
            for (const ref of accRef.rolesRefs) {
                if (ref.roleId === roleId) return true
            }
        }

        return false
    }

    public getRoleRefByRoleId(account:IAccount, workspaceId:string, accountRefId:string, roleId:string):IRoleRef|null {
        const accRef = accountWorkspaceAccountRefController.getWorkspaceAccountRefById(account, workspaceId, accountRefId)
        if (accRef && accRef.rolesRefs) {
            for (const ref of accRef.rolesRefs) {
                if (ref.roleId === roleId) return ref
            }
        }

        return null
    }

    public async getRoleRefByRefId(account:IAccount, workspaceId:string, accountRefId:string, roleRefId:string):Promise<IRoleRef|null> {
        const accRef = accountWorkspaceAccountRefController.getWorkspaceAccountRefById(account, workspaceId, accountRefId)
        if (accRef && accRef.rolesRefs) {
            for (const ref of accRef.rolesRefs) {
                if (ref._id === roleRefId) return ref
            }
        }

        return null
    }

    public async getRoleRef(accountId:string, workspaceId:string, accountRefId:string, roleRefId:string):Promise<IRoleRef|null> {
        if (!(accountId && workspaceId && accountRefId && roleRefId)) throw({code: 400})

        const account = await accountController.getAccount({_id: accountId})
        if (!account) throw({code: 404})

        const roleRef = this.getRoleRefByRefId(account, workspaceId, accountRefId, roleRefId)
        if (!roleRef) throw({code: 404})

        return roleRef
    }

    public async getRoleRefs(accountId:string, workspaceId:string, accountRefId:string):Promise<IRoleRef[]> {
        if (!accountId && workspaceId && accountRefId) throw({code: 400})

        const account = await accountController.getAccount({_id: accountId})
        if (!account) throw({code: 404})

        const accRef = accountWorkspaceAccountRefController.getWorkspaceAccountRefById(account, workspaceId, accountRefId)
        
        return accRef!.rolesRefs? accRef!.rolesRefs: []
    }

    public async saveRoleRef(accountId:string, workspaceId:string, accountRefId:string, roleId:string):Promise<IRoleRef|null> {
        if (!(accountId && workspaceId && accountRefId && roleId)) throw({code: 400})

        const account = await accountModel.findOne({_id: accountId})
        if (!account) throw({code: 404})

        const rolesMap = await roleController.getRolesMap()
        // check if role existed on roles collection
        if (!rolesMap[roleId]) throw({code: 404})
        // check if the role to update is existing on the account role refs
        if (this.hasRole(account, workspaceId, accountRefId, roleId)) throw({code: 409})
        const doc:{roleId:string, isActive?:boolean} = {roleId}

        account.workspaces.id(workspaceId)?.accountRefs?.id(accountRefId)?.rolesRefs?.push(doc)
        await account.save()
        await accountController.cachedData.removeCacheData(accountId)

        return this.getRoleRefByRoleId(account, workspaceId, accountRefId, roleId)
    }

    public async updateRoleRef(accountId:string, workspaceId:string, accountRefId:string, roleRefId:string, roleId:string|undefined):Promise<IRoleRef|null> {
        if (!(accountId && workspaceId && accountRefId && roleRefId && roleId)) throw({code: 400})

        const account = await accountModel.findOne({_id: accountId})
        if (!account) throw({code: 404})
        if (!account.workspaces.id(workspaceId)?.accountRefs?.id(accountRefId)?.rolesRefs?.id(roleRefId)) throw({code: 404})

        if (roleId) {
            const rolesMap = await roleController.getRolesMap()
            // check if role existed on roles collection
            if (!rolesMap[roleId]) throw({code: 404})

            // check if the role to update is existing on the role roles refs
            if (this.hasRole(account, workspaceId, accountRefId, roleId)) throw({code: 409})

            account.workspaces.id(workspaceId)!.accountRefs!.id(accountRefId)!.rolesRefs!.id(roleRefId)!.roleId = roleId
        }

        await account.save()
        await accountController.cachedData.removeCacheData(accountId)

        return account.rolesRefs!.id(roleRefId)
    }

    public async deleteRoleRef(accountId:string, workspaceId:string, accountRefId:string, roleRefId:string):Promise<IRoleRef|null> {
        if (!(accountId && workspaceId && accountRefId && roleRefId)) throw({code: 400})

        const account = await accountModel.findOne({_id: accountId})
        if (!account) throw({code: 404})

        const accRef = accountWorkspaceAccountRefController.getWorkspaceAccountRefById(account, workspaceId, accountRefId)
        // if account has only one role, then do not delete the role
        if (!accRef) throw({code: 404})
        if (accRef?.rolesRefs && accRef.rolesRefs.length <= 1) throw({code: 409})

        const roleRefData = account.workspaces.id(workspaceId)!.accountRefs!.id(accountRefId)!.rolesRefs!.id(roleRefId)
        if (roleRefData) {
            account.workspaces.id(workspaceId)!.accountRefs!.id(accountRefId)!.rolesRefs!.id(roleRefId)?.deleteOne()
            await account.save()
            await accountController.cachedData.removeCacheData(accountId)
        } else {
            throw({code: 404})
        }

        return roleRefData? roleRefData: null
    }
}

export default new AccountWorkspaceAccountRefRoleController()