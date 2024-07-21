import express, { Request, Response } from 'express'

// import UserModel, { IAccount } from '../dataSource/models/userModel'
import ErrorHandler from '../utilities/errorHandler'
import Config from '../utilities/config'
import routerIdentity from '../utilities/routerIdentity'
// import DataRequest, {IListOutput}  from '../utilities/dataQuery'

import userController, {IAccountCompleteInfo  } from '../controllers/userController'
import userRoleController from '../controllers/userRoleController'
import userUserInfoController from '../controllers/userUserInfoController'
import userContactInfoController from '../controllers/userContactInfoController'
import userPasswordController from '../controllers/userPasswordController'
import userLimitedTransactionController from '../controllers/userLimitedTransactionController'
import userClientDeviceController from '../controllers/userClientDeviceController'
import userClientDeviceAccessTokenController from '../controllers/userClientDeviceAccessTokenController'
import userWorkspaceController from '../controllers/userWorkspaceController'
import userWorkspaceUserRefController from '../controllers/userWorkspaceUserRefController'

import {
    IAccount, IRoleRef, IAccountInfo, IContactInfo,
    IPassword, ILimitedTransaction, IClientDevice, IAccessToken,
    IWorkspace, IWorkspaceAccountRef
} from '../dataSource/models/userModel'


const router = express.Router()
const env = Config.getEnv()


// root owner paths
router.get(env.RootApiEndpoint + 'owner', async (req:Request, res:Response) => {
    const accountId = req?.userData?._id
    const [result, statusCode] = await ErrorHandler.execute<IAccount>(async () => {
        return await userController.getUser({_id: accountId})
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'owner', async (req:Request, res:Response) => {
    const accountId = req?.userData?._id
    const { username, disabled, verified } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IAccount>(async () => {
        if (!accountId) return null
        return await userController.updateUser(accountId, username, disabled, verified)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'owner/completeInfo', async (req:Request, res:Response) => {
    const accountId = req?.userData?._id
    const [result, statusCode] = await ErrorHandler.execute<IAccountCompleteInfo>(async () => {
        return await userController.getAccountCompleteInfo({_id: accountId})
    })

    return res.status(statusCode).send(result)
})


// owner roles routes
router.get(env.RootApiEndpoint + 'owner/roles', async (req:Request, res:Response) => {
    const accountId = req?.userData?._id

    const [result, statusCode] = await ErrorHandler.execute<IRoleRef[]>(async () => {
        if (!accountId) return null
        return await userRoleController.getRoleRefs(accountId)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'owner/roles/:roleRefId', async (req:Request, res:Response) => {
    const accountId = req?.userData?._id
    const { roleRefId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IRoleRef>(async () => {
        if (!accountId) return null
        return await userRoleController.getRoleRef(accountId, roleRefId)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'owner/roles', async (req:Request, res:Response) => {
    const accountId = req?.userData?._id
    const { roleId, isActive } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IRoleRef>(async () => {
        if (!accountId) return null
        return await userRoleController.saveRoleRef(accountId, roleId, isActive)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'owner/roles/:roleRefId/activate', async (req, res) => {
    const accountId = req?.userData?._id || ''
    const { roleRefId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IRoleRef>(async () => {
        return await userRoleController.activateUserRole(accountId, roleRefId)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'owner/roles/:roleRefId', async (req:Request, res:Response) => {
    const accountId = req?.userData?._id
    const { roleRefId } = req.params
    const { roleId, isActive } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IRoleRef>(async () => {
        if (!accountId) return null
        return await userRoleController.updateRoleRef(accountId, roleRefId, roleId, isActive)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'owner/roles/:roleRefId', async (req:Request, res:Response) => {
    const accountId = req?.userData?._id
    const { roleRefId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IRoleRef>(async () => {
        if (!accountId) return null
        return await userRoleController.deleteRoleRef(accountId, roleRefId)
    })

    return res.status(statusCode).send(result)
})


// owner userInfo routes
router.get(env.RootApiEndpoint + 'owner/accountInfos', async (req:Request, res:Response) => {
    const accountId = req?.userData?._id

    const [result, statusCode] = await ErrorHandler.execute<IAccountInfo[]>(async () => {
        if (!accountId) return null
        return await userUserInfoController.getUserInfos(accountId)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'owner/accountInfos', async (req:Request, res:Response) => {
    const accountId = req?.userData?._id
    const { key, value, type } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IAccountInfo>(async () => {
        if (!accountId) return null
        return await userUserInfoController.saveUserInfo(accountId, key, value, type)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'owner/accountInfos/:accountInfoId', async (req:Request, res:Response) => {
     const accountId = req?.userData?._id
    const { accountInfoId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IAccountInfo>(async () => {
        if (!accountId) return null
        return await userUserInfoController.getUserInfo(accountId, accountInfoId)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'owner/accountInfos/:accountInfoId', async (req:Request, res:Response) => {
    const accountId = req?.userData?._id
    const { accountInfoId } = req.params
    const { key, value, type } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IAccountInfo>(async () => {
        if (!accountId) return null
        return await userUserInfoController.updateUserInfo(accountId, accountInfoId, key, value, type)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'owner/accountInfos/:accountInfoId', async (req:Request, res:Response) => {
    const accountId = req?.userData?._id
    const { accountInfoId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IAccountInfo>(async () => {
        if (!accountId) return null
        return await userUserInfoController.deleteUserInfo( accountId, accountInfoId )
    })

    return res.status(statusCode).send(result)
})


// contact infos routes
router.get(env.RootApiEndpoint + 'owner/contactInfos', async (req:Request, res:Response) => {
    const accountId = req?.userData?._id

    const [result, statusCode] = await ErrorHandler.execute<IContactInfo[]>(async () => {
        if (!accountId) return null
        return await userContactInfoController.getContactInfos(accountId)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'owner/contactInfos', async (req:Request, res:Response) => {
    const accountId = req?.userData?._id
    const { type, value, countryCode, verified } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IContactInfo>(async () => {
        if (!accountId) return null
        return await userContactInfoController.saveContactInfo(accountId, type, value, countryCode, verified)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'owner/contactInfos/:contactInfoId', async (req:Request, res:Response) => {
    const accountId = req?.userData?._id
    const { contactInfoId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IContactInfo>(async () => {
        if (!accountId) return null
        return await userContactInfoController.getContactInfo(accountId, contactInfoId)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'owner/contactInfos/:contactInfoId', async (req:Request, res:Response) => {
    const accountId = req?.userData?._id
    const { contactInfoId } = req.params
    const { type, value, countryCode, verified } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IContactInfo>(async () => {
        if (!accountId) return null
        return await userContactInfoController.updateContactInfo(accountId, contactInfoId, type, value, countryCode, verified)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'owner/contactInfos/:contactInfoId', async (req:Request, res:Response) => {
    const accountId = req?.userData?._id
    const { contactInfoId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IContactInfo>(async () => {
        if (!accountId) return null
        return await userContactInfoController.deleteContactInfo( accountId, contactInfoId )
    })

    return res.status(statusCode).send(result)
})


// passwords routes
router.get(env.RootApiEndpoint + 'owner/passwords', async (req:Request, res:Response) => {
    const accountId = req?.userData?._id

    const [result, statusCode] = await ErrorHandler.execute<IPassword[]>(async () => {
        if (!accountId) return null
        return await userPasswordController.getPasswords(accountId)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'owner/passwords', async (req:Request, res:Response) => {
    const accountId = req?.userData?._id
    const { currentPassword, newPassword } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IPassword>(async () => {
        if (!accountId) return null
        return await userPasswordController.savePassword(accountId, currentPassword, newPassword)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'owner/passwords/:passwordId', async (req:Request, res:Response) => {
    const accountId = req?.userData?._id
    const { passwordId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IPassword>(async () => {
        if (!accountId) return null
        return await userPasswordController.getPassword(accountId, passwordId)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'owner/passwords/:passwordId', async (req:Request, res:Response) => {
    const accountId = req?.userData?._id
    const { passwordId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IPassword>(async () => {
        if (!accountId) return null
        return await userPasswordController.deletePassword( accountId, passwordId )
    })

    return res.status(statusCode).send(result)
})


// limited transaction routes
router.get(env.RootApiEndpoint + 'owner/limitedTransactions', async (req:Request, res:Response) => {
    const accountId = req?.userData?._id

    const [result, statusCode] = await ErrorHandler.execute<ILimitedTransaction[]>(async () => {
        if (!accountId) return null
        return await userLimitedTransactionController.getLimitedTransactions(accountId)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'owner/limitedTransactions/:limitedTransactionId', async (req:Request, res:Response) => {
    const accountId = req?.userData?._id
    const { limitedTransactionId } = req.params

    console.log(limitedTransactionId)

    const [result, statusCode] = await ErrorHandler.execute<ILimitedTransaction>(async () => {
        if (!accountId) return null
        return await userLimitedTransactionController.getLimitedTransaction(accountId, limitedTransactionId)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'owner/limitedTransactions/:limitedTransactionId', async (req:Request, res:Response) => {
    const accountId = req?.userData?._id
    const { limitedTransactionId } = req.params
    const {
        limit, attempts, key,
        value, recipient,
        disabled
    } = req.body

    const [result, statusCode] = await ErrorHandler.execute<ILimitedTransaction>(async () => {
        if (!accountId) return null
        return await userLimitedTransactionController.updateLimitedTransaction(
            accountId, limitedTransactionId,
            limit, attempts, key,
            value, recipient,
            disabled
        )
    })

    return res.status(statusCode).send(result)
})


// client device routes
router.get(env.RootApiEndpoint + 'owner/clientDevices', async (req:Request, res:Response) => {
    const accountId = req?.userData?._id

    const [result, statusCode] = await ErrorHandler.execute<IClientDevice[]>(async () => {
        if (!accountId) return null
        return await userClientDeviceController.getClientDevices(accountId)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'owner/clientDevices', async (req:Request, res:Response) => {
    const accountId = req?.userData?._id
    const { ua, description, disabled } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IClientDevice>(async () => {
        if (!accountId) return null
        return await userClientDeviceController.saveClientDevice(accountId, ua, description, disabled)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'owner/clientDevices/:clientDeviceId', async (req:Request, res:Response) => {
    const accountId = req?.userData?._id
    const { clientDeviceId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IClientDevice>(async () => {
        if (!accountId) return null
        return await userClientDeviceController.getClientDevice(accountId, clientDeviceId)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'owner/clientDevices/:clientDeviceId', async (req:Request, res:Response) => {
    const accountId = req?.userData?._id
    const { clientDeviceId } = req.params
    const { ua, description, disabled } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IClientDevice>(async () => {
        if (!accountId) return null
        return await userClientDeviceController.updateClientDevice(accountId, clientDeviceId, ua, description, disabled)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'owner/clientDevices/:clientDeviceId', async (req:Request, res:Response) => {
    const accountId = req?.userData?._id
    const { clientDeviceId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IClientDevice>(async () => {
        if (!accountId) return null
        return await userClientDeviceController.deleteClientDevice( accountId, clientDeviceId )
    })

    return res.status(statusCode).send(result)
})


// client devices access token
router.get(env.RootApiEndpoint + 'owner/clientDevices/:clientDeviceId/accessTokens', async (req:Request, res:Response) => {
    const accountId = req?.userData?._id
    const { clientDeviceId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IAccessToken[]>(async () => {
        if (!accountId) return null
        return await userClientDeviceAccessTokenController.getClientDeviceAccessTokens(accountId, clientDeviceId)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'owner/clientDevices/:clientDeviceId/accessTokens', async (req:Request, res:Response) => {
    const accountId = req?.userData?._id
    const { clientDeviceId } = req.params
    const { expiration, description, ipAddress, disabled } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IAccessToken>(async () => {
        if (!accountId) return null
        return await userClientDeviceAccessTokenController.saveClientDeviceAccessToken(accountId, clientDeviceId, expiration, description, ipAddress, disabled)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'owner/clientDevices/:clientDeviceId/accessTokens/:accessTokenId', async (req:Request, res:Response) => {
    const accountId = req?.userData?._id
    const { clientDeviceId, accessTokenId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IAccessToken>(async () => {
        if (!accountId) return null
        return await userClientDeviceAccessTokenController.getClientDeviceAccessToken(accountId, clientDeviceId, accessTokenId)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'owner/clientDevices/:clientDeviceId/accessTokens/:accessTokenId', async (req:Request, res:Response) => {
    const accountId = req?.userData?._id
    const { clientDeviceId, accessTokenId } = req.params
    const { description, ipAddress, disabled } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IAccessToken>(async () => {
        if (!accountId) return null
        return await userClientDeviceAccessTokenController.updateClientDeviceAccessToken(accountId, clientDeviceId, accessTokenId, description, ipAddress, disabled)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'owner/clientDevices/:clientDeviceId/accessTokens/:accessTokenId', async (req:Request, res:Response) => {
    const accountId = req?.userData?._id
    const { clientDeviceId, accessTokenId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IAccessToken>(async () => {
        if (!accountId) return null
        return await userClientDeviceAccessTokenController.deleteClientDeviceAccessToken( accountId, clientDeviceId, accessTokenId )
    })

    return res.status(statusCode).send(result)
})

// workspaces
router.get(env.RootApiEndpoint + 'owner/workspaces', async (req, res) => {
    const accountId = req?.userData?._id || ''

    const [result, statusCode] = await ErrorHandler.execute<IWorkspace[]>(async () => {
        return await userWorkspaceController.getWorkspaces(accountId)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'owner/workspaces', async (req, res) => {
    const accountId = req?.userData?._id || ''
    const { name, description, isActive, disabled } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IWorkspace>(async () => {
        return await userWorkspaceController.saveWorkspace(accountId, name, description, isActive, disabled)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'owner/workspaces/:workspaceId', async (req, res) => {
    const accountId = req?.userData?._id || ''
    const { workspaceId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IWorkspace>(async () => {
        return await userWorkspaceController.getWorkspace(accountId, workspaceId)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'owner/workspaces/:workspaceId', async (req, res) => {
    const accountId = req?.userData?._id || ''
    const { workspaceId } = req.params
    const { name, description, isActive, disabled } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IWorkspace>(async () => {
        return await userWorkspaceController.updateWorkspace(accountId, workspaceId, name, description, isActive, disabled)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'owner/workspaces/:workspaceId', async (req, res) => {
    const accountId = req?.userData?._id || ''
    const { workspaceId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IWorkspace>(async () => {
        return await userWorkspaceController.deleteWorkspace( accountId, workspaceId )
    })

    return res.status(statusCode).send(result)
})

// workspace user refs
router.get(env.RootApiEndpoint + 'owner/workspaces/:workspaceId/accountRefs', async (req, res) => {
    const accountId = req?.userData?._id || ''
    const { workspaceId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<(IWorkspaceAccountRef & {username?:string})[]>(async () => {
        return await userWorkspaceUserRefController.getWorkspaceUserRefs(accountId, workspaceId)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'owner/workspaces/:workspaceId/accountRefs', async (req, res) => {
    const accountId = req?.userData?._id || ''
    const { workspaceId } = req.params
    const { username, readAccess, updateAccess, createAccess, deleteAccess, disabled } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IWorkspaceAccountRef>(async () => {
        return await userWorkspaceUserRefController.saveWorkspaceUserRef(accountId, workspaceId, username, readAccess, updateAccess, createAccess, deleteAccess, disabled)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'owner/workspaces/:workspaceId/accountRefs/:accountRefId', async (req, res) => {
    const accountId = req?.userData?._id || ''
    const { workspaceId, accountRefId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IWorkspaceAccountRef & {username?:string}>(async () => {
        return await userWorkspaceUserRefController.getWorkspaceUserRef(accountId, workspaceId, accountRefId)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'owner/workspaces/:workspaceId/accountRefs/:accountRefId', async (req, res) => {
    const accountId = req?.userData?._id || ''
    const { workspaceId, accountRefId } = req.params
    const { readAccess, updateAccess, createAccess, deleteAccess, disabled } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IWorkspaceAccountRef>(async () => {
        return await userWorkspaceUserRefController.updateWorkspaceUserRef(accountId, workspaceId, accountRefId, readAccess, updateAccess, createAccess, deleteAccess, disabled)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'owner/workspaces/:workspaceId/accountRefs/:accountRefId', async (req, res) => {
    const accountId = req?.userData?._id || ''
    const { workspaceId, accountRefId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IWorkspaceAccountRef>(async () => {
        return await userWorkspaceUserRefController.deleteWorkspaceUserRef( accountId, workspaceId, accountRefId )
    })

    return res.status(statusCode).send(result)
})

routerIdentity.addAppRouteObj(router)
export default router