import UserModel, { IAccount, IWorkspaceAccountRef } from '../dataSource/models/userModel'
import userController from './userController'
import userWorkspaceController from './userWorkspaceController'
import DataCleaner from '../utilities/dataCleaner'
import appEvents from '../utilities/appEvents'
// import Config from '../utilities/config'

// const env = Config.getEnv()

class UserWorkspaceUserRefController {

    public getWorkspaceUserRefById(user:IAccount, workspaceId:string, userRefId:string):IWorkspaceAccountRef|null {

        const workspace = userWorkspaceController.getWorkspaceById(user, workspaceId)
        if (workspace && workspace.userRefs) {
            for (const userRef of workspace.userRefs) {
                if (userRef._id === userRefId) return userRef
            }
        }

        return null
    }

    public getWorkspaceUserRefByUserId(user:IAccount, workspaceId:string, userId:string):IWorkspaceAccountRef|null {

        const workspace = userWorkspaceController.getWorkspaceById(user, workspaceId)
        if (workspace && workspace.userRefs) {
            for (const userRef of workspace.userRefs) {
                if (userRef.userId === userId) return userRef
            }
        }

        return null
    }

    public async getWorkspaceUserRef(userId:string, workspaceId:string, userRefId:string):Promise<IWorkspaceAccountRef & {username?:string}|null> {
        if (!(userId && workspaceId && userRefId)) throw({code: 400})

        const user = await userController.getUser({_id: userId})
        if (!user) throw({code: 404})

        const userRef:IWorkspaceAccountRef & {username?:string}|null = this.getWorkspaceUserRefById(user, workspaceId, userRefId)
        if (!userRef) throw({code: 404})

        const userData = await userController.getUser({_id: userRef.userId})
        userRef.username = userData?.username

        return userRef
    }

    public async getWorkspaceUserRefs(userId:string, workspaceId:string):Promise<(IWorkspaceAccountRef & {username?:string})[]> {
        if (!userId) throw({code: 400})

        const user = await userController.getUser({_id: userId})
        if (!user) throw({code: 404})

        const workspace = userWorkspaceController.getWorkspaceById(user, workspaceId)
        let userRefs:(IWorkspaceAccountRef & {username?:string})[] = workspace?.userRefs? workspace.userRefs: []

        const usersData = await UserModel.find({_id: {$in: userRefs.map(item => item.userId)}})
        const userDataMap = usersData.reduce((acc:{[key:string]:IAccount}, item) => {
            acc[item._id] = item
            return acc
        }, {})

        return userRefs.map(item => {
            item.username = userDataMap[item.userId].username
            return item
        })
    }

    public async saveWorkspaceUserRef(
            userId:string,
            workspaceId:string,
            username:string,
            readAccess:boolean|string,
            updateAccess:boolean|string,
            createAccess:boolean|string,
            deleteAccess:boolean|string,
            disabled:boolean|string
        ):Promise<IWorkspaceAccountRef|null> {

        if (!(userId && workspaceId && username)) throw({code: 400})

        const user = await UserModel.findOne({_id: userId})
        const assignedUser = await UserModel.findOne({username})
        if (!user) throw({code: 404})
        if (!assignedUser) throw({code: 404, message: `${ username } does not exist!`})
        if (user._id === assignedUser._id) throw({code: 409, message: 'cannot assign the workspace owner'})
        if (this.getWorkspaceUserRefByUserId(user, workspaceId, assignedUser._id)) throw({code: 409, message: `${ username } was already assigned to this workspace!`})

        const doc:IWorkspaceAccountRef = {
            userId: assignedUser._id
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
        if (DataCleaner.getBooleanData(disabled).isValid) {
            doc.disabled = DataCleaner.getBooleanData(disabled).data
        }
        user.workspaces!.id(workspaceId)?.userRefs?.push(doc)

        await user.save()
        await userController.cachedData.removeCacheData(userId)

        // emit event
        appEvents.emit('workspace-update', {
            action: 'add',
            user: user,
            assignedUser,
            workspace: user.workspaces!.id(workspaceId)
        })

        const lastIndex = user.workspaces!.id(workspaceId)!.userRefs!.length - 1
        return user.workspaces!.id(workspaceId)!.userRefs![lastIndex]
    }

    public async updateWorkspaceUserRef(
            userId:string,
            workspaceId:string,
            userRefId:string,
            readAccess:boolean|string,
            updateAccess:boolean|string,
            createAccess:boolean|string,
            deleteAccess:boolean|string,
            disabled:boolean|string
        ):Promise<IWorkspaceAccountRef|null> {

        if (!(userId && workspaceId && userRefId)) throw({code: 400})

        const user = await UserModel.findOne({_id: userId})
        if (!user) throw({code: 404})
        if (!this.getWorkspaceUserRefById(user, workspaceId, userRefId)) throw({code: 404})

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
        if (DataCleaner.getBooleanData(disabled).isValid) {
            user.workspaces!.id(workspaceId)!.userRefs!.id(userRefId)!.disabled = DataCleaner.getBooleanData(disabled).data
        }

        await user.save()
        await userController.cachedData.removeCacheData(userId)

        return user.workspaces!.id(workspaceId)!.userRefs!.id(userRefId)
    }

    public async deleteWorkspaceUserRef(userId:string, workspaceId:string, userRefId:string):Promise<IWorkspaceAccountRef|null> {
        if (!(userId && workspaceId)) throw({code: 400})

        const user = await UserModel.findOne({_id: userId})
        if (!user) throw({code: 404})

        const workspaceUserRefData = this.getWorkspaceUserRefById(user, workspaceId, userRefId)
        if (workspaceUserRefData) {
            user.workspaces!.id(workspaceId)!.userRefs!.id(userRefId)?.deleteOne()
            await user.save()
            await userController.cachedData.removeCacheData(userId)

            const assignedUser = await UserModel.findOne({_id: workspaceUserRefData.userId})
            // emit event
            appEvents.emit('workspace-update', {
                action: 'remove',
                user: user,
                assignedUser,
                workspace: user.workspaces!.id(workspaceId)
            })
        } else {
            throw({code: 404})
        }

        return workspaceUserRefData? workspaceUserRefData: null
    }
}

export default new UserWorkspaceUserRefController()