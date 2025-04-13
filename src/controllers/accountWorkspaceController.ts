import UAParser, {IResult}  from 'ua-parser-js'
import accountModel, { IAccount, IWorkspace } from '../dataSource/models/accountModel'
import accountController from './accountController'
import DataCleaner from '../utilities/dataCleaner'
// import Config from '../utilities/config'

// const env = Config.getEnv()

class AccountWorkspaceController {
    public getWorkspaceById(account:IAccount, workspaceId:string):IWorkspace|null {

        if (account && account.workspaces) {
            for (const workspace of account.workspaces) {
                if (workspace._id === workspaceId) return workspace
            }
        }

        return null
    }

    public async getWorkspace(accountId:string, workspaceId:string):Promise<IWorkspace|null> {
        if (!(accountId && workspaceId)) throw({code: 400})

        const account = await accountController.getAccount({_id: accountId})
        if (!account) throw({code: 404})

        const workspace = this.getWorkspaceById(account, workspaceId)
        if (!workspace) throw({code: 404})

        return workspace
    }

    public async getExternalWorkspaces(accountId:string):Promise<(IWorkspace & {ownerId:string, ownerNameId: string, ownerAccountType: string})[]> {
        let result:(IWorkspace & {ownerId:string, ownerNameId: string, ownerAccountType: string})[] = []
        if (!accountId) throw({code: 400})

        const extWorkspaces:(IWorkspace & {ownerId:string, ownerNameId: string, ownerAccountType: string})[] = await accountModel.aggregate<IWorkspace & {ownerId:string, ownerNameId: string, ownerAccountType: string}>([
            {
              '$match': {
                'workspaces.accountRefs.accountId': accountId
              }
            }, {
              '$unwind': {
                'path': '$workspaces', 
                'preserveNullAndEmptyArrays': false
              }
            }, {
              '$addFields': {
                'account': '$workspaces.accountRefs'
              }
            }, {
              '$unwind': {
                'path': '$account', 
                'preserveNullAndEmptyArrays': false
              }
            }, {
              '$match': {
                'account.accountId': accountId,
                'account.accepted': true,
                'account.declined': false,
                'account.disabled': false
              }
            }, {
              '$project': {
                '_id': '$workspaces._id',
                'name': '$workspaces.name',
                'description': '$workspaces.description',
                'ownerId': '$_id',
                'ownerNameId': '$nameId',
                'ownerAccountType': '$accountType',
                'isActive': '$workspaces.isActive',
                'accountRefs': '$workspaces.accountRefs',
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

    public async getWorkspaces(accountId:string):Promise<IWorkspace[]> {
        let result:IWorkspace[] = []
        if (!accountId) throw({code: 400})

        const account = await accountController.getAccount({_id: accountId})
        if (!account) throw({code: 404})
        result = account!.workspaces? account!.workspaces: []

        return result
    }

    public async saveWorkspace(accountId:string, name:string, description:string|undefined, disabled:boolean|string):Promise<IWorkspace|null> {
        if (!(accountId && name)) throw({code: 400})

        const account = await accountModel.findOne({_id: accountId})
        if (!account) throw({code: 404})

        const doc:IWorkspace = {
            name: name,
            description: description
        }
        if (DataCleaner.getBooleanData(disabled).isValid) {
            doc.disabled = DataCleaner.getBooleanData(disabled).data
        }

        account.workspaces!.push(doc)

        await account.save()
        await accountController.cachedData.removeCacheData(accountId)

        return account.workspaces[account.workspaces.length - 1]
    }

    public async updateWorkspace(accountId:string, workspaceId:string, name:string, description:string|undefined, disabled:boolean|string):Promise<IWorkspace|null> {
        if (!(accountId && workspaceId)) throw({code: 400})

        const account = await accountModel.findOne({_id: accountId})
        if (!account) throw({code: 404})
        if (!account.workspaces?.id(workspaceId)) throw({code: 404})

        if (name) account.workspaces!.id(workspaceId)!.name = name
        if (description) account.workspaces!.id(workspaceId)!.description = description

        if (DataCleaner.getBooleanData(disabled).isValid) {
            account.workspaces!.id(workspaceId)!.disabled = DataCleaner.getBooleanData(disabled).data
        }

        await account.save()
        await accountController.cachedData.removeCacheData(accountId)

        return account.workspaces!.id(workspaceId)
    }

    public async deleteWorkspace(accountId:string, workspaceId:string):Promise<IWorkspace|null> {
        if (!(accountId && workspaceId)) throw({code: 400})

        const account = await accountModel.findOne({_id: accountId})
        if (!account) throw({code: 404})

        const workspaceData = account!.workspaces?.id(workspaceId)
        if (workspaceData) {
            account!.workspaces?.id(workspaceId)?.deleteOne()
            await account.save()
            await accountController.cachedData.removeCacheData(accountId)
        } else {
            throw({code: 404})
        }

        return workspaceData? workspaceData: null
    }
}

export default new AccountWorkspaceController()