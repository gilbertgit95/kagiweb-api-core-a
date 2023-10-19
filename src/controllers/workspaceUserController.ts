import { IUser } from '../dataSource/models/userModel'
import WorkspaceModel, { IWorkspace, IUserRef } from '../dataSource/models/workspaceModel'
import DataRequest, { IListOutput, IPgeInfo } from '../utilities/dataQuery'
import DataCleaner from '../utilities/dataCleaner'
import userController from './userController'
import workspaceController from './workspaceController'
// import Config from '../utilities/config'

// const env = Config.getEnv()

class WorkspaceUsersController {

    public hasUser(workspace:IWorkspace, userId:string):boolean {
        if (workspace && workspace.usersRefs) {
            for (let ref of workspace.usersRefs) {
                if (ref.userId === userId) return true
            }
        }

        return false
    }

    public getUserRefByUserId(workspace:IWorkspace, userId:string):IUserRef|null {

        if (workspace && workspace.usersRefs) {
            for (let ref of workspace.usersRefs) {
                if (ref.userId === userId) return ref
            }
        }

        return null
    }

    public getUserRefByRefId(workspace:IWorkspace, userRefId:string):IUserRef|null {

        if (workspace && workspace.usersRefs) {
            for (let ref of workspace.usersRefs) {
                if (ref._id === userRefId) return ref
            }
        }

        return null
    }

    public async getUserRef(workspaceId:string, userRefId:string):Promise<IUserRef|null> {
        if (!(workspaceId && userRefId)) throw({code: 400})

        const workspace = await workspaceController.getWorkspace({_id: workspaceId})
        if (!workspace) throw({code: 404})

        const userRef = this.getUserRefByRefId(workspace, userRefId)
        if (!userRef) throw({code: 404})

        return userRef
    }

    public async getUserRefs(workspaceId:string):Promise<IUserRef[]> {
        let result:IUserRef[] = []
        if (!workspaceId) throw({code: 400})

        const workspace = await workspaceController.getWorkspace({_id: workspaceId})
        if (!workspace) throw({code: 404})
        result = workspace!.usersRefs? workspace!.usersRefs: []

        return result
    }

    public async saveUserRef(currUser:string, workspaceId:string, userId:string, readAccess:string|boolean, writeAccess:string|boolean):Promise<IUserRef|null> {
        if (!(workspaceId && userId)) throw({code: 400})

        const workspace = await WorkspaceModel.findOne({_id: workspaceId})
        if (!workspace) throw({code: 404})

        const user = await userController.getUser({_id: userId})
        // check if workspace existed on workspaces collection
        if (!user) throw({code: 404})

        // check if the workspace to update is existing on the workspace workspaces refs
        if (this.hasUser(workspace, userId)) throw({code: 409})
        const doc:{userId?:string, readAccess?:boolean, writeAccess?:boolean} = {userId}
        if (DataCleaner.getBooleanData(readAccess).isValid) doc.readAccess = DataCleaner.getBooleanData(readAccess).data
        if (DataCleaner.getBooleanData(writeAccess).isValid) doc.writeAccess = DataCleaner.getBooleanData(writeAccess).data

        workspace.usersRefs!.push(doc)
        workspace.modifiedBy = currUser

        await workspace.save()
        await workspaceController.cachedData.removeCacheData(workspaceId)

        return this.getUserRefByUserId(workspace, userId)
    }

    public async updateUserRef(currUser:string, workspaceId:string, userRefId:string, userId:string, readAccess:string|boolean, writeAccess:string|boolean):Promise<IUserRef|null> {
        if (!(workspaceId && userRefId && userId)) throw({code: 400})

        const workspace = await WorkspaceModel.findOne({_id: workspaceId})
        if (!workspace) throw({code: 404})
        if (!workspace.usersRefs?.id(userRefId)) throw({code: 404})

        const user = await userController.getUser({_id: userId})
        // check if workspace existed on workspaces collection
        if (!user) throw({code: 404})

        // check if the workspace to update is existing on the workspace workspaces refs
        if (this.hasUser(workspace, userId)) throw({code: 409})

        workspace.usersRefs!.id(userRefId)!.userId = userId
        if (DataCleaner.getBooleanData(readAccess).isValid) {
            workspace.usersRefs!.id(userRefId)!.readAccess = DataCleaner.getBooleanData(readAccess).data
        }
        if (DataCleaner.getBooleanData(writeAccess).isValid) {
            workspace.usersRefs!.id(userRefId)!.writeAccess = DataCleaner.getBooleanData(writeAccess).data
        }
        workspace.modifiedBy = currUser

        await workspace.save()
        await workspaceController.cachedData.removeCacheData(workspaceId)

        return workspace.usersRefs!.id(userRefId)
    }

    public async deleteUserRef(currUserId:string, workspaceId:string, userRefId:string):Promise<IUserRef|null> {
        if (!(workspaceId && userRefId)) throw({code: 400})

        const workspace = await WorkspaceModel.findOne({_id: workspaceId})
        if (!workspace) throw({code: 404})

        const userRefData = workspace!.usersRefs?.id(userRefId)
        if (userRefData) {
            workspace!.usersRefs?.id(userRefId)?.deleteOne()
            await workspace.save()
            await workspaceController.cachedData.removeCacheData(workspaceId)
        } else {
            throw({code: 404})
        }

        return userRefData? userRefData: null
    }
}

export default new WorkspaceUsersController()