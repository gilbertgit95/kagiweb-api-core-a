import { Document } from 'mongoose'
import accountModel, { IAccount, IWorkspaceAccountRef } from '../dataSource/models/accountModel'
import accountController from './accountController'
import roleController from './roleController'
import accountWorkspaceController from './accountWorkspaceController'
import notificationController from './notificationController'
import DataCleaner from '../utilities/dataCleaner'
import appEvents from '../utilities/appEvents'
// import Config from '../utilities/config'

// const env = Config.getEnv()

class AccountWorkspaceAccountRefController {

    public getWorkspaceAccountRefById(account:IAccount, workspaceId:string, accountRefId:string):IWorkspaceAccountRef|null {

        const workspace = accountWorkspaceController.getWorkspaceById(account, workspaceId)
        if (workspace && workspace.accountRefs) {
            for (const accountRef of workspace.accountRefs) {
                if (accountRef._id === accountRefId) return accountRef
            }
        }

        return null
    }

    public getWorkspaceAccountRefByAccountId(account:IAccount, workspaceId:string, accountId:string):IWorkspaceAccountRef|null {

        const workspace = accountWorkspaceController.getWorkspaceById(account, workspaceId)
        if (workspace && workspace.accountRefs) {
            for (const accountRef of workspace.accountRefs) {
                if (accountRef.accountId === accountId) return accountRef
            }
        }

        return null
    }

    public async getWorkspaceAccountRef(accountId:string, workspaceId:string, accountRefId:string):Promise<IWorkspaceAccountRef & {nameId?:string}|null> {
        if (!(accountId && workspaceId && accountRefId)) throw({code: 400})

        const account = await accountController.getAccount({_id: accountId})
        if (!account) throw({code: 404})

        const accountRef:IWorkspaceAccountRef & {nameId?:string}|null = this.getWorkspaceAccountRefById(account, workspaceId, accountRefId)
        if (!accountRef) throw({code: 404})

        const accountData = await accountController.getAccount({_id: accountRef.accountId})
        accountRef.nameId = accountData?.nameId

        return accountRef
    }

    public async getWorkspaceAccountRefs(accountId:string, workspaceId:string):Promise<(IWorkspaceAccountRef & {nameId?:string})[]> {
        if (!accountId) throw({code: 400})

        const account = await accountController.getAccount({_id: accountId})
        if (!account) throw({code: 404})

        const workspace = accountWorkspaceController.getWorkspaceById(account, workspaceId)
        let accountRefs:(IWorkspaceAccountRef & {nameId?:string})[] = workspace?.accountRefs? workspace.accountRefs: []

        const accountsData = await accountModel.find({_id: {$in: accountRefs.map(item => item.accountId)}})
        const accountDataMap = accountsData.reduce((acc:{[key:string]:IAccount}, item) => {
            acc[item._id] = item
            return acc
        }, {})

        return accountRefs.map(item => {
            item.nameId = accountDataMap[item.accountId].nameId
            return item
        })
    }

    public async saveWorkspaceAccountRef(
            accountId:string,
            workspaceId:string,
            nameId:string,
            disabled:boolean|string
        ):Promise<IWorkspaceAccountRef|null> {

        if (!(accountId && workspaceId && nameId)) throw({code: 400})

        const account = await accountModel.findOne({_id: accountId})
        const assignedAccount = await accountModel.findOne({nameId})
        if (!account) throw({code: 404})
        if (!assignedAccount) throw({code: 404, message: `${ nameId } does not exist!`})
        if (account._id === assignedAccount._id) throw({code: 409, message: 'cannot assign the workspace owner'})
        if (this.getWorkspaceAccountRefByAccountId(account, workspaceId, assignedAccount._id)) throw({code: 409, message: `${ nameId } was already assigned to this workspace!`})

        const workspace = accountWorkspaceController.getWorkspaceById(account, workspaceId)
        if (!workspace) throw({code: 404, message: 'Workspace not found!'})

        const leastRole = await roleController.getLeastRole('workspace')
        if (!leastRole) throw({code: 404, message: 'Empty role'})

        const doc:any = {
            accountId: assignedAccount._id,
            accountConfigs: [
                {
                    key: 'default-role',
                    value: leastRole._id,
                    type: 'string'
                }
            ],
            rolesRefs: [{
                roleId: leastRole._id
            }]
        }

        if (DataCleaner.getBooleanData(disabled).isValid) {
            doc.disabled = DataCleaner.getBooleanData(disabled).data
        }
        account.workspaces!.id(workspaceId)?.accountRefs?.push(doc)
        const refDoc = account.workspaces!.id(workspaceId)?.accountRefs![account.workspaces!.id(workspaceId)!.accountRefs!.length - 1]

        await account.save()
        await accountController.cachedData.removeCacheData(accountId)

        // create notification to assigned account
        // const notificationData = {
        //     accountId: assignedAccount._id,
        //     type: 'info',
        //     title: 'Workspace Level Access Invitation',
        //     message: `Hello ${ assignedAccount.nameId }, you are invited to join the workspace ${ workspace.name } under account ${ account.nameId } with a role ${ leastRole.name }. Please accept the invitation.`,
        //     links: [{
        //         label: 'Accept/Decline',
        //         url: `/owner/view/${ assignedAccount._id }/actions/invitation/module/account/${ account._id }/subModule/workspace/${workspaceId}/ref/accountRef/${ refDoc!._id }`,
        //     }]
        // }
        // console.log('notificationData: ', notificationData)

        await notificationController.saveNotification(
            assignedAccount._id,
            'info',
            'Workspace Level Access Invitation',
            `Hello ${ assignedAccount.nameId }, you are invited to join the workspace ${ workspace.name } under account ${ account.nameId } with a role ${ leastRole.name }. Please accept the invitation.`,
            [{
                label: 'Accept/Decline',
                url: `/owner/view/${ assignedAccount._id }/actions/invitation/module/account/${ account._id }/subModule/workspace/${workspaceId}/ref/accountRef/${ refDoc!._id }`,
            }]
        )

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
            // readAccess:boolean|string,
            // updateAccess:boolean|string,
            // createAccess:boolean|string,
            // deleteAccess:boolean|string,
            disabled:boolean|string
        ):Promise<IWorkspaceAccountRef|null> {

        if (!(accountId && workspaceId && accountRefId)) throw({code: 400})

        const account = await accountModel.findOne({_id: accountId})
        if (!account) throw({code: 404})
        if (!this.getWorkspaceAccountRefById(account, workspaceId, accountRefId)) throw({code: 404})

        // if (DataCleaner.getBooleanData(readAccess).isValid) {
        //     account.workspaces!.id(workspaceId)!.accountRefs!.id(accountRefId)!.readAccess = DataCleaner.getBooleanData(readAccess).data
        // }
        // if (DataCleaner.getBooleanData(updateAccess).isValid) {
        //     account.workspaces!.id(workspaceId)!.accountRefs!.id(accountRefId)!.updateAccess = DataCleaner.getBooleanData(updateAccess).data
        // }
        // if (DataCleaner.getBooleanData(createAccess).isValid) {
        //     account.workspaces!.id(workspaceId)!.accountRefs!.id(accountRefId)!.createAccess = DataCleaner.getBooleanData(createAccess).data
        // }
        // if (DataCleaner.getBooleanData(deleteAccess).isValid) {
        //     account.workspaces!.id(workspaceId)!.accountRefs!.id(accountRefId)!.deleteAccess = DataCleaner.getBooleanData(deleteAccess).data
        // }
        // if (DataCleaner.getBooleanData(disabled).isValid) {
        //     account.workspaces!.id(workspaceId)!.accountRefs!.id(accountRefId)!.disabled = DataCleaner.getBooleanData(disabled).data
        // }

        await account.save()
        await accountController.cachedData.removeCacheData(accountId)

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
            await accountController.cachedData.removeCacheData(accountId)

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