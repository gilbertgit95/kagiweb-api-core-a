import UserModel, { IUser, IRoleRef } from '../dataSource/models/userModel'
import userController from './userController'
import roleController from './roleController'
import DataCleaner from '../utilities/dataCleaner'
// import Config from '../utilities/config'

// const env = Config.getEnv()

class RoleFeaturesController {
    public hasRole(user:IUser, roleId:string):boolean {
        if (user && user.rolesRefs) {
            for (let ref of user.rolesRefs) {
                if (ref.roleId === roleId) return true
            }
        }

        return false
    }

    public getRoleRefByRoleId(user:IUser, roleId:string):IRoleRef|null {

        if (user && user.rolesRefs) {
            for (let ref of user.rolesRefs) {
                if (ref.roleId === roleId) return ref
            }
        }

        return null
    }

    public async getRoleRefByRefId(user:IUser, roleRefId:string):Promise<IRoleRef|null> {

        if (user && user.rolesRefs) {
            for (let ref of user.rolesRefs) {
                if (ref._id === roleRefId) return ref
            }
        }

        return null
    }

    public async getRoleRef(userId:string, roleRefId:string):Promise<IRoleRef|null> {
        if (!(userId && roleRefId)) throw(400)

        const user = await userController.getUser({_id: userId})
        if (!user) throw(404)

        const roleRef = this.getRoleRefByRefId(user, roleRefId)
        if (!roleRef) throw(404)

        return roleRef
    }

    public async getUserRoleRefs(userId:string):Promise<IRoleRef[]> {
        if (!userId) throw(400)

        const user = await userController.getUser({_id: userId})
        if (!user) throw(404)
        
        return user!.rolesRefs? user!.rolesRefs: []
    }

    public async saveRoleRef(userId:string, roleId:string, isActive:boolean|string):Promise<IRoleRef|null> {
        if (!(userId && roleId)) throw(400)

        const user = await UserModel.findOne({_id: userId})
        if (!user) throw(404)

        const rolesMap = await roleController.getRolesMap()
        // check if role existed on roles collection
        if (!rolesMap[roleId]) throw(404)
        // check if the role to update is existing on the user role refs
        if (this.hasRole(user, roleId)) throw(409)
        const doc:{roleId:string, isActive?:boolean} = {roleId}

        if (DataCleaner.getBooleanData(isActive).isValid) {
            doc.isActive = DataCleaner.getBooleanData(isActive).data
        }
        user.rolesRefs!.push(doc)
        await user.save()
        await userController.cachedData.removeCacheData(userId)

        return this.getRoleRefByRoleId(user, roleId)
    }

    public async updateRoleRef(userId:string, roleRefId:string, roleId:string, isActive:boolean|string):Promise<IRoleRef|null> {
        if (!(userId && roleRefId)) throw(400)

        const user = await UserModel.findOne({_id: userId})
        if (!user) throw(404)
        if (!user.rolesRefs?.id(roleRefId)) throw(404)

        if (roleId) {
            const rolesMap = await roleController.getRolesMap()
            // check if role existed on roles collection
            if (!rolesMap[roleId]) throw(404)

            // check if the role to update is existing on the role roles refs
            if (this.hasRole(user, roleId)) throw(409)

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
        if (!(userId && roleRefId)) throw(400)

        const user = await UserModel.findOne({_id: userId})
        if (!user) throw(404)

        // if user has only one role, then do not delete the role
        if (user.rolesRefs.length <= 1) throw(409)

        const roleRefData = user!.rolesRefs?.id(roleRefId)
        if (roleRefData) {
            user!.rolesRefs?.id(roleRefId)?.deleteOne()
            await user.save()
            await userController.cachedData.removeCacheData(userId)
        } else {
            throw(404)
        }

        return roleRefData? roleRefData: null
    }
}

export default new RoleFeaturesController()