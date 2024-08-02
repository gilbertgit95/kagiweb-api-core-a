import accountModel, { IAccount, IWorkspaceAccountRef } from '../dataSource/models/accountModel'
import userController from './accountController'
import userWorkspaceController from './accountWorkspaceController'
import DataCleaner from '../utilities/dataCleaner'
import appEvents from '../utilities/appEvents'
// import Config from '../utilities/config'

// const env = Config.getEnv()

class UserWorkspaceUserRefController {

    public getWorkspaceUserRefById(account:IAccount, workspaceId:string, userRefId:string):IWorkspaceAccountRef|null {

        const workspace = userWorkspaceController.getWorkspaceById(account, workspaceId)
        if (workspace && workspace.userRefs) {
            for (const accountRef of workspace.userRefs) {
                if (accountRef._id === userRefId) return accountRef
            }
        }

        return null
    }

    public getWorkspaceUserRefByUserId(account:IAccount, workspaceId:string, accountId:string):IWorkspaceAccountRef|null {

        const workspace = userWorkspaceController.getWorkspaceById(account, workspaceId)
        if (workspace && workspace.userRefs) {
            for (const accountRef of workspace.userRefs) {
                if (accountRef.userId === accountId) return accountRef
            }
        }

        return null
    }

    public async getWorkspaceUserRef(accountId:string, workspaceId:string, userRefId:string):Promise<IWorkspaceAccountRef & {username?:string}|null> {
        if (!(accountId && workspaceId && userRefId)) throw({code: 400})

        const account = await userController.getUser({_id: accountId})
        if (!account) throw({code: 404})

        const accountRef:IWorkspaceAccountRef & {username?:string}|null = this.getWorkspaceUserRefById(account, workspaceId, userRefId)
        if (!accountRef) throw({code: 404})

        const userData = await userController.getUser({_id: accountRef.userId})
        accountRef.username = userData?.username

        return accountRef
    }

    public async getWorkspaceUserRefs(accountId:string, workspaceId:string):Promise<(IWorkspaceAccountRef & {username?:string})[]> {
        if (!accountId) throw({code: 400})

        const account = await userController.getUser({_id: accountId})
        if (!account) throw({code: 404})

        const workspace = userWorkspaceController.getWorkspaceById(account, workspaceId)
        let accountRefs:(IWorkspaceAccountRef & {username?:string})[] = workspace?.userRefs? workspace.userRefs: []

        const accountsData = await accountModel.find({_id: {$in: accountRefs.map(item => item.userId)}})
        const accountDataMap = accountsData.reduce((acc:{[key:string]:IAccount}, item) => {
            acc[item._id] = item
            return acc
        }, {})

        return accountRefs.map(item => {
            item.username = accountDataMap[item.userId].username
            return item
        })
    }

    public async saveWorkspaceUserRef(
            accountId:string,
            workspaceId:string,
            username:string,
            readAccess:boolean|string,
            updateAccess:boolean|string,
            createAccess:boolean|string,
            deleteAccess:boolean|string,
            disabled:boolean|string
        ):Promise<IWorkspaceAccountRef|null> {

        if (!(accountId && workspaceId && username)) throw({code: 400})

        const account = await accountModel.findOne({_id: accountId})
        const assignedAccount = await accountModel.findOne({username})
        if (!account) throw({code: 404})
        if (!assignedAccount) throw({code: 404, message: `${ username } does not exist!`})
        if (account._id === assignedAccount._id) throw({code: 409, message: 'cannot assign the workspace owner'})
        if (this.getWorkspaceUserRefByUserId(account, workspaceId, assignedAccount._id)) throw({code: 409, message: `${ username } was already assigned to this workspace!`})

        const doc:IWorkspaceAccountRef = {
            userId: assignedAccount._id
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
        account.workspaces!.id(workspaceId)?.userRefs?.push(doc)

        await account.save()
        await userController.cachedData.removeCacheData(accountId)

        // emit event
        appEvents.emit('workspace-update', {
            action: 'add',
            account: account,
            assignedAccount,
            workspace: account.workspaces!.id(workspaceId)
        })

        const lastIndex = account.workspaces!.id(workspaceId)!.userRefs!.length - 1
        return account.workspaces!.id(workspaceId)!.userRefs![lastIndex]
    }

    public async updateWorkspaceUserRef(
            accountId:string,
            workspaceId:string,
            userRefId:string,
            readAccess:boolean|string,
            updateAccess:boolean|string,
            createAccess:boolean|string,
            deleteAccess:boolean|string,
            disabled:boolean|string
        ):Promise<IWorkspaceAccountRef|null> {

        if (!(accountId && workspaceId && userRefId)) throw({code: 400})

        const account = await accountModel.findOne({_id: accountId})
        if (!account) throw({code: 404})
        if (!this.getWorkspaceUserRefById(account, workspaceId, userRefId)) throw({code: 404})

        if (DataCleaner.getBooleanData(readAccess).isValid) {
            account.workspaces!.id(workspaceId)!.userRefs!.id(userRefId)!.readAccess = DataCleaner.getBooleanData(readAccess).data
        }
        if (DataCleaner.getBooleanData(updateAccess).isValid) {
            account.workspaces!.id(workspaceId)!.userRefs!.id(userRefId)!.updateAccess = DataCleaner.getBooleanData(updateAccess).data
        }
        if (DataCleaner.getBooleanData(createAccess).isValid) {
            account.workspaces!.id(workspaceId)!.userRefs!.id(userRefId)!.createAccess = DataCleaner.getBooleanData(createAccess).data
        }
        if (DataCleaner.getBooleanData(deleteAccess).isValid) {
            account.workspaces!.id(workspaceId)!.userRefs!.id(userRefId)!.deleteAccess = DataCleaner.getBooleanData(deleteAccess).data
        }
        if (DataCleaner.getBooleanData(disabled).isValid) {
            account.workspaces!.id(workspaceId)!.userRefs!.id(userRefId)!.disabled = DataCleaner.getBooleanData(disabled).data
        }

        await account.save()
        await userController.cachedData.removeCacheData(accountId)

        return account.workspaces!.id(workspaceId)!.userRefs!.id(userRefId)
    }

    public async deleteWorkspaceUserRef(accountId:string, workspaceId:string, userRefId:string):Promise<IWorkspaceAccountRef|null> {
        if (!(accountId && workspaceId)) throw({code: 400})

        const account = await accountModel.findOne({_id: accountId})
        if (!account) throw({code: 404})

        const workspaceUserRefData = this.getWorkspaceUserRefById(account, workspaceId, userRefId)
        if (workspaceUserRefData) {
            account.workspaces!.id(workspaceId)!.userRefs!.id(userRefId)?.deleteOne()
            await account.save()
            await userController.cachedData.removeCacheData(accountId)

            const assignedAccount = await accountModel.findOne({_id: workspaceUserRefData.userId})
            // emit event
            appEvents.emit('workspace-update', {
                action: 'remove',
                account: account,
                assignedAccount,
                workspace: account.workspaces!.id(workspaceId)
            })
        } else {
            throw({code: 404})
        }

        return workspaceUserRefData? workspaceUserRefData: null
    }
}

export default new UserWorkspaceUserRefController()