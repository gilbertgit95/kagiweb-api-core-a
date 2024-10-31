import accountModel, { IAccount, IRoleRef } from '../dataSource/models/accountModel'
import accountController from './accountController'
import roleController from './roleController'
import DataCleaner from '../utilities/dataCleaner'
// import Config from '../utilities/config'

// const env = Config.getEnv()

class AccountWorkspaceAccountRefRoleController {
    public hasRole(account:IAccount, roleId:string):boolean {
        if (account && account.rolesRefs) {
            for (const ref of account.rolesRefs) {
                if (ref.roleId === roleId) return true
            }
        }

        return false
    }

    public getRoleRefByRoleId(account:IAccount, roleId:string):IRoleRef|null {

        if (account && account.rolesRefs) {
            for (const ref of account.rolesRefs) {
                if (ref.roleId === roleId) return ref
            }
        }

        return null
    }

    public async getRoleRefByRefId(account:IAccount, roleRefId:string):Promise<IRoleRef|null> {

        if (account && account.rolesRefs) {
            for (const ref of account.rolesRefs) {
                if (ref._id === roleRefId) return ref
            }
        }

        return null
    }

    public async getRoleRef(accountId:string, roleRefId:string):Promise<IRoleRef|null> {
        if (!(accountId && roleRefId)) throw({code: 400})

        const account = await accountController.getAccount({_id: accountId})
        if (!account) throw({code: 404})

        const roleRef = this.getRoleRefByRefId(account, roleRefId)
        if (!roleRef) throw({code: 404})

        return roleRef
    }

    public async getRoleRefs(accountId:string):Promise<IRoleRef[]> {
        if (!accountId) throw({code: 400})

        const account = await accountController.getAccount({_id: accountId})
        if (!account) throw({code: 404})
        
        return account!.rolesRefs? account!.rolesRefs: []
    }

    public async saveRoleRef(accountId:string, roleId:string):Promise<IRoleRef|null> {
        if (!(accountId && roleId)) throw({code: 400})

        const account = await accountModel.findOne({_id: accountId})
        if (!account) throw({code: 404})

        const rolesMap = await roleController.getRolesMap()
        // check if role existed on roles collection
        if (!rolesMap[roleId]) throw({code: 404})
        // check if the role to update is existing on the account role refs
        if (this.hasRole(account, roleId)) throw({code: 409})
        const doc:{roleId:string, isActive?:boolean} = {roleId}

        account.rolesRefs!.push(doc)
        await account.save()
        await accountController.cachedData.removeCacheData(accountId)

        return this.getRoleRefByRoleId(account, roleId)
    }

    public async updateRoleRef(accountId:string, roleRefId:string, roleId:string|undefined):Promise<IRoleRef|null> {
        if (!(accountId && roleRefId)) throw({code: 400})

        const account = await accountModel.findOne({_id: accountId})
        if (!account) throw({code: 404})
        if (!account.rolesRefs?.id(roleRefId)) throw({code: 404})

        if (roleId) {
            const rolesMap = await roleController.getRolesMap()
            // check if role existed on roles collection
            if (!rolesMap[roleId]) throw({code: 404})

            // check if the role to update is existing on the role roles refs
            if (this.hasRole(account, roleId)) throw({code: 409})

            account.rolesRefs!.id(roleRefId)!.roleId = roleId
        }

        await account.save()
        await accountController.cachedData.removeCacheData(accountId)

        return account.rolesRefs!.id(roleRefId)
    }

    public async deleteRoleRef(accountId:string, roleRefId:string):Promise<IRoleRef|null> {
        if (!(accountId && roleRefId)) throw({code: 400})

        const account = await accountModel.findOne({_id: accountId})
        if (!account) throw({code: 404})

        // if account has only one role, then do not delete the role
        if (account.rolesRefs.length <= 1) throw({code: 409})

        const roleRefData = account!.rolesRefs?.id(roleRefId)
        if (roleRefData) {
            account!.rolesRefs?.id(roleRefId)?.deleteOne()
            await account.save()
            await accountController.cachedData.removeCacheData(accountId)
        } else {
            throw({code: 404})
        }

        return roleRefData? roleRefData: null
    }
}

export default new AccountWorkspaceAccountRefRoleController()