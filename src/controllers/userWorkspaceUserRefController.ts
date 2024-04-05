import UserModel, { IUser, IWorkspaceUserRef } from '../dataSource/models/userModel'
import userController from './userController'
import userWorkspaceController from './userWorkspaceController'
import DataCleaner from '../utilities/dataCleaner'
// import Config from '../utilities/config'

// const env = Config.getEnv()

class UserWorkspaceUserRefController {

    public getWorkspaceUserRefById(user:IUser, workspaceId:string, userRefId:string):IWorkspaceUserRef|null {

        const workspace = userWorkspaceController.getWorkspaceById(user, workspaceId)
        if (workspace && workspace.userRefs) {
            for (const userRef of workspace.userRefs) {
                if (userRef._id === userRefId) return userRef
            }
        }

        return null
    }

    public async getWorkspaceUserRef(userId:string, workspaceId:string, userRefId:string):Promise<IWorkspaceUserRef|null> {
        if (!(userId && workspaceId && userRefId)) throw({code: 400})

        const user = await userController.getUser({_id: userId})
        if (!user) throw({code: 404})

        const userRef = this.getWorkspaceUserRefById(user, workspaceId, userRefId)
        if (!userRef) throw({code: 404})

        return userRef
    }

    public async getWorkspaceUserRefs(userId:string, workspaceId:string):Promise<IWorkspaceUserRef[]> {
        if (!userId) throw({code: 400})

        const user = await userController.getUser({_id: userId})
        if (!user) throw({code: 404})

        const workspace = userWorkspaceController.getWorkspaceById(user, workspaceId)

        return workspace && workspace.userRefs? workspace.userRefs: []
    }

    public async saveWorkspaceUserRef(
            userId:string,
            workspaceId:string,
            userRef:string,
            readAccess:boolean|string,
            updateAccess:boolean|string,
            createAccess:boolean|string,
            deleteAccess:boolean|string,
            accepted:boolean|string,
            disabled:boolean|string
        ):Promise<IWorkspaceUserRef|null> {

        if (!(userId && workspaceId && userRef)) throw({code: 400})

        const user = await UserModel.findOne({_id: userId})
        if (!user) throw({code: 404})

        const doc:IWorkspaceUserRef = {
            userId: userRef
        }
        if (DataCleaner.getBooleanData(readAccess).isValid) {
            doc.readAccess = DataCleaner.getBooleanData(readAccess).data
        }
        if (DataCleaner.getBooleanData(updateAccess).isValid) {
            doc.updateAccess = DataCleaner.getBooleanData(updateAccess).data
        }
        if (DataCleaner.getBooleanData(createAccess).isValid) {
            doc.createAccess = DataCleaner.getBooleanData(createAccess).data
        }
        if (DataCleaner.getBooleanData(deleteAccess).isValid) {
            doc.deleteAccess = DataCleaner.getBooleanData(deleteAccess).data
        }
        if (DataCleaner.getBooleanData(accepted).isValid) {
            doc.accepted = DataCleaner.getBooleanData(accepted).data
        }
        if (DataCleaner.getBooleanData(disabled).isValid) {
            doc.disabled = DataCleaner.getBooleanData(disabled).data
        }
        user.workspaces!.id(workspaceId)?.userRefs?.push(doc)

        await user.save()
        await userController.cachedData.removeCacheData(userId)

        const lastIndex = user.workspaces!.id(workspaceId)!.userRefs!.length - 1
        return user.workspaces!.id(workspaceId)!.userRefs![lastIndex]
    }

    public async updateWorkspaceUserRef(
            userId:string,
            workspaceId:string,
            userRefId:string,
            userRef:string|undefined,
            readAccess:boolean|string,
            updateAccess:boolean|string,
            createAccess:boolean|string,
            deleteAccess:boolean|string,
            accepted:boolean|string,
            disabled:boolean|string
        ):Promise<IWorkspaceUserRef|null> {

        if (!(userId && workspaceId && userRefId)) throw({code: 400})

        const user = await UserModel.findOne({_id: userId})
        if (!user) throw({code: 404})
        if (!this.getWorkspaceUserRefById(user, workspaceId, userRefId)) throw({code: 404})

        if (userRef) user.workspaces!.id(workspaceId)!.userRefs!.id(userRefId)!.userId = userRef
        if (DataCleaner.getBooleanData(readAccess).isValid) {
            user.workspaces!.id(workspaceId)!.userRefs!.id(userRefId)!.readAccess = DataCleaner.getBooleanData(readAccess).data
        }
        if (DataCleaner.getBooleanData(updateAccess).isValid) {
            user.workspaces!.id(workspaceId)!.userRefs!.id(userRefId)!.updateAccess = DataCleaner.getBooleanData(updateAccess).data
        }
        if (DataCleaner.getBooleanData(createAccess).isValid) {
            user.workspaces!.id(workspaceId)!.userRefs!.id(userRefId)!.createAccess = DataCleaner.getBooleanData(createAccess).data
        }
        if (DataCleaner.getBooleanData(deleteAccess).isValid) {
            user.workspaces!.id(workspaceId)!.userRefs!.id(userRefId)!.deleteAccess = DataCleaner.getBooleanData(deleteAccess).data
        }
        if (DataCleaner.getBooleanData(accepted).isValid) {
            user.workspaces!.id(workspaceId)!.userRefs!.id(userRefId)!.accepted = DataCleaner.getBooleanData(accepted).data
        }
        if (DataCleaner.getBooleanData(disabled).isValid) {
            user.workspaces!.id(workspaceId)!.userRefs!.id(userRefId)!.disabled = DataCleaner.getBooleanData(disabled).data
        }

        await user.save()
        await userController.cachedData.removeCacheData(userId)

        return user.workspaces!.id(workspaceId)!.userRefs!.id(userRefId)
    }

    public async deleteWorkspaceUserRef(userId:string, workspaceId:string, userRefId:string):Promise<IWorkspaceUserRef|null> {
        if (!(userId && workspaceId)) throw({code: 400})

        const user = await UserModel.findOne({_id: userId})
        if (!user) throw({code: 404})

        const workspaceUserRefData = this.getWorkspaceUserRefById(user, workspaceId, userRefId)
        if (workspaceUserRefData) {
            user.workspaces!.id(workspaceId)!.userRefs!.id(userRefId)?.deleteOne()
            await user.save()
            await userController.cachedData.removeCacheData(userId)
        } else {
            throw({code: 404})
        }

        return workspaceUserRefData? workspaceUserRefData: null
    }
}

export default new UserWorkspaceUserRefController()