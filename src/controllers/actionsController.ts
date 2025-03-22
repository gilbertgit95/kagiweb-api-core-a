import accountModel, { IWorkspace } from '../dataSource/models/accountModel'

class ActionsController {
    // accounts/:accountId/actions/:actionType/module/:moduleType/:moduleId/ref/:refType/:refId
    public async getAccountActionInfo(accountId:string, actionType:string, moduleType:string, moduleId:string, refType:string, refId:string):Promise<boolean> {
        // invitations
        if (actionType === 'invitation') {
            // if moduleType is account get account invitation
            if (moduleType === 'account') {
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
                        'account.accountId': accountId
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
            }
        }

        return true
    }

    // accounts/:accountId/actions/:actionType/module/:moduleType/:moduleId/subModule/:subModuleType/:subModuleId/ref/:refType/:refId
    public async getAccountWorkspaceActionInfo(accountId:string, actionType:string, moduleType:string, moduleId:string, subModuleType:string, subModuleId:string, refType:string, refId:string):Promise<boolean> {
        return true
    }

    public async acceptOrDeclineAccountAction(accountId:string, actionType:string, moduleType:string, moduleId:string, refType:string, refId:string, accept:boolean):Promise<boolean> {

        return true
    }

    public async acceptOrDeclineAccountWorkspaceAction(accountId:string, actionType:string, moduleType:string, moduleId:string, subModuleType:string, subModuleId:string, refType:string, refId:string, accept:boolean):Promise<boolean> {

        return true
    }
}

export default new ActionsController()