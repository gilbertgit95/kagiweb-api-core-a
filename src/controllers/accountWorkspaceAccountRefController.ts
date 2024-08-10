import accountModel, { IAccount, IWorkspaceAccountRef } from '../dataSource/models/accountModel'
import userController from './accountController'
import userWorkspaceController from './accountWorkspaceController'
import DataCleaner from '../utilities/dataCleaner'
import appEvents from '../utilities/appEvents'
// import Config from '../utilities/config'

// const env = Config.getEnv()

class AccountWorkspaceAccountRefController {

    public getWorkspaceAccountRefById(account:IAccount, workspaceId:string, accountRefId:string):IWorkspaceAccountRef|null {

        const workspace = userWorkspaceController.getWorkspaceById(account, workspaceId)
        if (workspace && workspace.accountRefs) {
            for (const accountRef of workspace.accountRefs) {
                if (accountRef._id === accountRefId) return accountRef
            }
        }

        return null
    }

    public getWorkspaceAccountRefByAccountId(account:IAccount, workspaceId:string, accountId:string):IWorkspaceAccountRef|null {

        const workspace = userWorkspaceController.getWorkspaceById(account, workspaceId)
        if (workspace && workspace.accountRefs) {
            for (const accountRef of workspace.accountRefs) {
                if (accountRef.accountId === accountId) return accountRef
            }
        }

        return null
    }

    public async getWorkspaceAccountRef(accountId:string, workspaceId:string, accountRefId:string):Promise<IWorkspaceAccountRef & {username?:string}|null> {
        if (!(accountId && workspaceId && accountRefId)) throw({code: 400})

        const account = await userController.getAccount({_id: accountId})
        if (!account) throw({code: 404})

        const accountRef:IWorkspaceAccountRef & {username?:string}|null = this.getWorkspaceAccountRefById(account, workspaceId, accountRefId)
        if (!accountRef) throw({code: 404})

        const userData = await userController.getAccount({_id: accountRef.accountId})
        accountRef.username = userData?.username

        return accountRef
    }

    public async getWorkspaceAccountRefs(accountId:string, workspaceId:string):Promise<(IWorkspaceAccountRef & {username?:string})[]> {
        if (!accountId) throw({code: 400})

        const account = await userController.getAccount({_id: accountId})
        if (!account) throw({code: 404})

        const workspace = userWorkspaceController.getWorkspaceById(account, workspaceId)
        let accountRefs:(IWorkspaceAccountRef & {username?:string})[] = workspace?.accountRefs? workspace.accountRefs: []

        const accountsData = await accountModel.find({_id: {$in: accountRefs.map(item => item.accountId)}})
        const accountDataMap = accountsData.reduce((acc:{[key:string]:IAccount}, item) => {
            acc[item._id] = item
            return acc
        }, {})

        return accountRefs.map(item => {
            item.username = accountDataMap[item.accountId].username
            return item
        })
    }

    public async saveWorkspaceAccountRef(
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
        if (this.getWorkspaceAccountRefByAccountId(account, workspaceId, assignedAccount._id)) throw({code: 409, message: `${ username } was already assigned to this workspace!`})

        const doc:IWorkspaceAccountRef = {
            accountId: assignedAccount._id
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
        account.workspaces!.id(workspaceId)?.accountRefs?.push(doc)

        await account.save()
        await userController.cachedData.removeCacheData(accountId)

        // emit event
        appEvents.emit('workspace-update', {
            action: 'add',
            account: account,
            assignedAccount,
            workspace: account.workspaces!.id(workspaceId)
        })

        const lastIndex = account.workspaces!.id(workspaceId)!.accountRefs!.length - 1
        return account.workspaces!.id(workspaceId)!.accountRefs![lastIndex]
    }

    public async updateWorkspaceAccountRef(
            accountId:string,
            workspaceId:string,
            accountRefId:string,
            readAccess:boolean|string,
            updateAccess:boolean|string,
            createAccess:boolean|string,
            deleteAccess:boolean|string,
            disabled:boolean|string
        ):Promise<IWorkspaceAccountRef|null> {

        if (!(accountId && workspaceId && accountRefId)) throw({code: 400})

        const account = await accountModel.findOne({_id: accountId})
        if (!account) throw({code: 404})
        if (!this.getWorkspaceAccountRefById(account, workspaceId, accountRefId)) throw({code: 404})

        if (DataCleaner.getBooleanData(readAccess).isValid) {
            account.workspaces!.id(workspaceId)!.accountRefs!.id(accountRefId)!.readAccess = DataCleaner.getBooleanData(readAccess).data
        }
        if (DataCleaner.getBooleanData(updateAccess).isValid) {
            account.workspaces!.id(workspaceId)!.accountRefs!.id(accountRefId)!.updateAccess = DataCleaner.getBooleanData(updateAccess).data
        }
        if (DataCleaner.getBooleanData(createAccess).isValid) {
            account.workspaces!.id(workspaceId)!.accountRefs!.id(accountRefId)!.createAccess = DataCleaner.getBooleanData(createAccess).data
        }
        if (DataCleaner.getBooleanData(deleteAccess).isValid) {
            account.workspaces!.id(workspaceId)!.accountRefs!.id(accountRefId)!.deleteAccess = DataCleaner.getBooleanData(deleteAccess).data
        }
        if (DataCleaner.getBooleanData(disabled).isValid) {
            account.workspaces!.id(workspaceId)!.accountRefs!.id(accountRefId)!.disabled = DataCleaner.getBooleanData(disabled).data
        }

        await account.save()
        await userController.cachedData.removeCacheData(accountId)

        return account.workspaces!.id(workspaceId)!.accountRefs!.id(accountRefId)
    }

    public async deleteWorkspaceAccountRef(accountId:string, workspaceId:string, accountRefId:string):Promise<IWorkspaceAccountRef|null> {
        if (!(accountId && workspaceId)) throw({code: 400})

        const account = await accountModel.findOne({_id: accountId})
        if (!account) throw({code: 404})

        const workspaceAccountRefData = this.getWorkspaceAccountRefById(account, workspaceId, accountRefId)
        if (workspaceAccountRefData) {
            account.workspaces!.id(workspaceId)!.accountRefs!.id(accountRefId)?.deleteOne()
            await account.save()
            await userController.cachedData.removeCacheData(accountId)

            const assignedAccount = await accountModel.findOne({_id: workspaceAccountRefData.accountId})
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

        return workspaceAccountRefData? workspaceAccountRefData: null
    }
}

export default new AccountWorkspaceAccountRefController()