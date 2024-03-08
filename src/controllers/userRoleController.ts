import UserModel, { IUser, IRoleRef } from '../dataSource/models/userModel'
import userController from './userController'
import roleController from './roleController'
import DataCleaner from '../utilities/dataCleaner'
// import Config from '../utilities/config'

// const env = Config.getEnv()

class UserRoleController {
    public getActiveRoleRef(user:IUser):IRoleRef|null {
        if (user && user.rolesRefs) {
            for (const ref of user.rolesRefs) {
                if (ref.isActive) return ref
            }
        }

        return null
    }

    public hasRole(user:IUser, roleId:string):boolean {
        if (user && user.rolesRefs) {
            for (const ref of user.rolesRefs) {
                if (ref.roleId === roleId) return true
            }
        }

        return false
    }

    public getRoleRefByRoleId(user:IUser, roleId:string):IRoleRef|null {

        if (user && user.rolesRefs) {
            for (const ref of user.rolesRefs) {
                if (ref.roleId === roleId) return ref
            }
        }

        return null
    }

    public async getRoleRefByRefId(user:IUser, roleRefId:string):Promise<IRoleRef|null> {

        if (user && user.rolesRefs) {
            for (const ref of user.rolesRefs) {
                if (ref._id === roleRefId) return ref
            }
        }

        return null
    }

    public async getRoleRef(userId:string, roleRefId:string):Promise<IRoleRef|null> {
        if (!(userId && roleRefId)) throw({code: 400})

        const user = await userController.getUser({_id: userId})
        if (!user) throw({code: 404})

        const roleRef = this.getRoleRefByRefId(user, roleRefId)
        if (!roleRef) throw({code: 404})

        return roleRef
    }

    public async getRoleRefs(userId:string):Promise<IRoleRef[]> {
        if (!userId) throw({code: 400})

        const user = await userController.getUser({_id: userId})
        if (!user) throw({code: 404})
        
        return user!.rolesRefs? user!.rolesRefs: []
    }

    public async saveRoleRef(userId:string, roleId:string, isActive:boolean|string):Promise<IRoleRef|null> {
        if (!(userId && roleId)) throw({code: 400})

        const user = await UserModel.findOne({_id: userId})
        if (!user) throw({code: 404})

        const rolesMap = await roleController.getRolesMap()
        // check if role existed on roles collection
        if (!rolesMap[roleId]) throw({code: 404})
        // check if the role to update is existing on the user role refs
        if (this.hasRole(user, roleId)) throw({code: 409})
        const doc:{roleId:string, isActive?:boolean} = {roleId}

        if (DataCleaner.getBooleanData(isActive).isValid) {
            doc.isActive = DataCleaner.getBooleanData(isActive).data
        }
        user.rolesRefs!.push(doc)
        await user.save()
        await userController.cachedData.removeCacheData(userId)

        return this.getRoleRefByRoleId(user, roleId)
    }

    public async updateRoleRef(userId:string, roleRefId:string, roleId:string|undefined, isActive:boolean|string):Promise<IRoleRef|null> {
        if (!(userId && roleRefId)) throw({code: 400})

        const user = await UserModel.findOne({_id: userId})
        if (!user) throw({code: 404})
        if (!user.rolesRefs?.id(roleRefId)) throw({code: 404})

        if (roleId) {
            const rolesMap = await roleController.getRolesMap()
            // check if role existed on roles collection
            if (!rolesMap[roleId]) throw({code: 404})

            // check if the role to update is existing on the role roles refs
            if (this.hasRole(user, roleId)) throw({code: 409})

            user.rolesRefs!.id(roleRefId)!.roleId = roleId
        }
        if (DataCleaner.getBooleanData(isActive).isValid) {
            user.rolesRefs!.id(roleRefId)!.isActive = DataCleaner.getBooleanData(isActive).data
        }

        await user.save()
        await userController.cachedData.removeCacheData(userId)

        return user.rolesRefs!.id(roleRefId)
    }

    public async deleteRoleRef(userId:string, roleRefId:string):Promise<IRoleRef|null> {
        if (!(userId && roleRefId)) throw({code: 400})

        const user = await UserModel.findOne({_id: userId})
        if (!user) throw({code: 404})

        // if user has only one role, then do not delete the role
        if (user.rolesRefs.length <= 1) throw({code: 409})

        const roleRefData = user!.rolesRefs?.id(roleRefId)
        if (roleRefData) {
            user!.rolesRefs?.id(roleRefId)?.deleteOne()
            await user.save()
            await userController.cachedData.removeCacheData(userId)
        } else {
            throw({code: 404})
        }

        return roleRefData? roleRefData: null
    }
}

export default new UserRoleController()