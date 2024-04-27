import UAParser, {IResult}  from 'ua-parser-js'
import UserModel, { IUser, IWorkspace } from '../dataSource/models/userModel'
import userController from './userController'
import DataCleaner from '../utilities/dataCleaner'
// import Config from '../utilities/config'

// const env = Config.getEnv()

class UserWorkspaceController {
    public getActiveWorkspace(user:IUser):IWorkspace|null {

        if (user && user.workspaces) {
            for (const workspace of user.workspaces) {
                if (workspace.isActive) return workspace
            }
        }

        return null
    }

    public getWorkspaceById(user:IUser, workspaceId:string):IWorkspace|null {

        if (user && user.workspaces) {
            for (const workspace of user.workspaces) {
                if (workspace._id === workspaceId) return workspace
            }
        }

        return null
    }

    public async getWorkspace(userId:string, workspaceId:string):Promise<IWorkspace|null> {
        if (!(userId && workspaceId)) throw({code: 400})

        const user = await userController.getUser({_id: userId})
        if (!user) throw({code: 404})

        const workspace = this.getWorkspaceById(user, workspaceId)
        if (!workspace) throw({code: 404})

        return workspace
    }

    public async getExternalWorkspaces(userId:string):Promise<(IWorkspace & {ownerId:string, ownerUsername: string})[]> {
        let result:(IWorkspace & {ownerId:string, ownerUsername: string})[] = []
        if (!userId) throw({code: 400})

        const extWorkspaces:(IWorkspace & {ownerId:string, ownerUsername: string})[] = await UserModel.aggregate<IWorkspace & {ownerId:string, ownerUsername: string}>([
            {
              '$match': {
                'workspaces.userRefs.userId': userId
              }
            }, {
              '$unwind': {
                'path': '$workspaces', 
                'preserveNullAndEmptyArrays': false
              }
            }, {
              '$addFields': {
                'user': '$workspaces.userRefs'
              }
            }, {
              '$unwind': {
                'path': '$user', 
                'preserveNullAndEmptyArrays': false
              }
            }, {
              '$match': {
                'user.userId': userId
              }
            }, {
              '$project': {
                '_id': '$workspaces._id',
                'name': '$workspaces.name',
                'description': '$workspaces.description',
                'ownerId': '$_id',
                'ownerUsername': '$username',
                'isActive': '$workspaces.isActive',
                'userRefs': '$workspaces.userRefs',
                'createdAt': '$workspaces.createdAt',
                'updatedAt': '$workspaces.updatedAt',
                'disabled': '$workspaces.disabled'
              }
            }
        ])
        
        if (!extWorkspaces) throw({code: 404})
        result = extWorkspaces

        return result
    }

    public async getWorkspaces(userId:string):Promise<IWorkspace[]> {
        let result:IWorkspace[] = []
        if (!userId) throw({code: 400})

        const user = await userController.getUser({_id: userId})
        if (!user) throw({code: 404})
        result = user!.workspaces? user!.workspaces: []

        return result
    }

    public async saveWorkspace(userId:string, name:string, description:string|undefined, isActive:boolean|string, disabled:boolean|string):Promise<IWorkspace|null> {
        if (!(userId && name)) throw({code: 400})

        const user = await UserModel.findOne({_id: userId})
        if (!user) throw({code: 404})

        const doc:IWorkspace = {
            name: name,
            description: description
        }
        if (DataCleaner.getBooleanData(isActive).isValid) {
            doc.isActive = DataCleaner.getBooleanData(isActive).data
        }
        if (DataCleaner.getBooleanData(disabled).isValid) {
            doc.disabled = DataCleaner.getBooleanData(disabled).data
        }

        user.workspaces!.push(doc)

        await user.save()
        await userController.cachedData.removeCacheData(userId)

        return user.workspaces[user.workspaces.length - 1]
    }

    public async updateWorkspace(userId:string, workspaceId:string, name:string, description:string|undefined, isActive:boolean|string, disabled:boolean|string):Promise<IWorkspace|null> {
        if (!(userId && workspaceId)) throw({code: 400})

        const user = await UserModel.findOne({_id: userId})
        if (!user) throw({code: 404})
        if (!user.workspaces?.id(workspaceId)) throw({code: 404})

        if (name) user.workspaces!.id(workspaceId)!.name = name
        if (description) user.workspaces!.id(workspaceId)!.description = description

        if (DataCleaner.getBooleanData(isActive).isValid) {
            user.workspaces!.id(workspaceId)!.isActive = DataCleaner.getBooleanData(isActive).data
        }
        if (DataCleaner.getBooleanData(disabled).isValid) {
            user.workspaces!.id(workspaceId)!.disabled = DataCleaner.getBooleanData(disabled).data
        }

        await user.save()
        await userController.cachedData.removeCacheData(userId)

        return user.workspaces!.id(workspaceId)
    }

    public async deleteWorkspace(userId:string, workspaceId:string):Promise<IWorkspace|null> {
        if (!(userId && workspaceId)) throw({code: 400})

        const user = await UserModel.findOne({_id: userId})
        if (!user) throw({code: 404})

        const workspaceData = user!.workspaces?.id(workspaceId)
        if (workspaceData) {
            user!.workspaces?.id(workspaceId)?.deleteOne()
            await user.save()
            await userController.cachedData.removeCacheData(userId)
        } else {
            throw({code: 404})
        }

        return workspaceData? workspaceData: null
    }
}

export default new UserWorkspaceController()