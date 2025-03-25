import accountModel, { IWorkspace, IAccountAccountRef } from '../dataSource/models/accountModel'
import { IRole } from '../dataSource/models/roleModel'

interface IAccountActionInfo {
    _id: string,
    fromAccount: {
        _id: string,
        nameId: string
    },
    toAccount: {
        _id: string,
        nameId: string
    },
    ref: IAccountAccountRef,
    refRole: IRole
}

class ActionsController {
    // accounts/:accountId/actions/:actionType/module/:moduleType/:moduleId/ref/:refType/:refId
    public async getAccountActionInfo(accountId:string, actionType:string, moduleType:string, moduleId:string, refType:string, refId:string):Promise<boolean> {
        // invitations
        if (actionType === 'invitation') {
            // if moduleType is account get account invitation
            if (moduleType === 'account') {
                // get account where the account is referenced: username, id
                // get the the account reference data
                // get the account reference role

                const actionInfo:IAccountActionInfo[] = await accountModel.aggregate<IAccountActionInfo>([
                  {
                    $match: {
                      "accountRefs.accountId":
                        "37410e75-1760-4bb6-85e0-d0a138d374bc"
                    }
                  },
                  {
                    $unwind: {
                      path: "$accountRefs",
                      preserveNullAndEmptyArrays: false
                    }
                  },
                  {
                    $match: {
                      "accountRefs.accountId":
                        "37410e75-1760-4bb6-85e0-d0a138d374bc"
                    }
                  },
                  {
                    $unwind: {
                      path: "$accountRefs.accountConfigs",
                      preserveNullAndEmptyArrays: false
                    }
                  },
                  {
                    $match: {
                      "accountRefs.accountConfigs.key":
                        "default-role"
                    }
                  },
                  {
                    $lookup: {
                      from: "roles",
                      localField:
                        "accountRefs.accountConfigs.value",
                      foreignField: "_id",
                      as: "accountAccountRole"
                    }
                  },
                  {
                    $unwind: {
                      path: "$accountAccountRole",
                      preserveNullAndEmptyArrays: false
                    }
                  },
                  {
                    $lookup:
                      {
                        from: "accounts",
                        localField: "accountRefs.accountId",
                        foreignField: "_id",
                        as: "fromAccount"
                      }
                  },
                  {
                    $unwind:
                      {
                        path: "$fromAccount",
                        preserveNullAndEmptyArrays: false
                      }
                  },
                  {
                    $project: {
                      "toAccount._id": "$_id",
                      "toAccount.nameId": "$nameId",
                      "fromAccount._id": "$fromAccount._id",
                      "fromAccount.nameId": "$fromAccount.nameId",
                      ref: "$accountRefs",
                      refRole: "$accountAccountRole"
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