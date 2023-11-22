import express, { Request, Response } from 'express'

// import UserModel, { IUser } from '../dataSource/models/userModel'
import ErrorHandler from '../utilities/errorHandler'
import Config from '../utilities/config'
import routerIdentity from '../utilities/routerIdentity'
import DataRequest, {IListOutput}  from '../utilities/dataQuery'

import userController from '../controllers/userController'
import userRoleController from '../controllers/userRoleController'
import userUserInfoController from '../controllers/userUserInfoController'
import userContactInfoController from '../controllers/userContactInfoController'
import userPasswordController from '../controllers/userPasswordController'
import userLimitedTransactionController from '../controllers/userLimitedTransactionController'
import userClientDeviceController from '../controllers/userClientDeviceController'
import userClientDeviceAccessTokenController from '../controllers/userClientDeviceAccessTokenController'
import workspaceController from '../controllers/workspaceController'
import workspaceUserController from '../controllers/workspaceUserController'

import {
    IUser, IRoleRef, IUserInfo, IContactInfo,
    IPassword, ILimitedTransaction, IClientDevice, IAccessToken
} from '../dataSource/models/userModel'
import {
    IWorkspace,
    IUserRef
} from '../dataSource/models/workspaceModel'

const router = express.Router()
const env = Config.getEnv()


// root owner paths
router.get(env.RootApiEndpoint + 'owner', async (req:Request, res:Response) => {
    const userId = req?.userData?._id
    const [result, statusCode] = await ErrorHandler.execute<IUser>(async () => {
        return await userController.getUser({_id: userId})
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'owner', async (req:Request, res:Response) => {
    const userId = req?.userData?._id
    const { username, disabled, verified } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IUser>(async () => {
        if (!userId) return null
        return await userController.updateUser(userId, username, disabled, verified)
    })

    return res.status(statusCode).send(result)
})


// owner roles routes
router.get(env.RootApiEndpoint + 'owner/roles', async (req:Request, res:Response) => {
    const userId = req?.userData?._id

    const [result, statusCode] = await ErrorHandler.execute<IRoleRef[]>(async () => {
        if (!userId) return null
        return await userRoleController.getRoleRefs(userId)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'owner/roles/:roleRefId', async (req:Request, res:Response) => {
    const userId = req?.userData?._id
    const { roleRefId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IRoleRef>(async () => {
        if (!userId) return null
        return await userRoleController.getRoleRef(userId, roleRefId)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'owner/roles', async (req:Request, res:Response) => {
    const userId = req?.userData?._id
    const { roleId, isActive } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IRoleRef>(async () => {
        if (!userId) return null
        return await userRoleController.saveRoleRef(userId, roleId, isActive)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'owner/roles/:roleRefId', async (req:Request, res:Response) => {
    const userId = req?.userData?._id
    const { roleRefId } = req.params
    const { roleId, isActive } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IRoleRef>(async () => {
        if (!userId) return null
        return await userRoleController.updateRoleRef(userId, roleRefId, roleId, isActive)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'owner/roles/:roleRefId', async (req:Request, res:Response) => {
    const userId = req?.userData?._id
    const { roleRefId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IRoleRef>(async () => {
        if (!userId) return null
        return await userRoleController.deleteRoleRef(userId, roleRefId)
    })

    return res.status(statusCode).send(result)
})


// owner userInfo routes
router.get(env.RootApiEndpoint + 'owner/userInfos', async (req:Request, res:Response) => {
    const userId = req?.userData?._id

    const [result, statusCode] = await ErrorHandler.execute<IUserInfo[]>(async () => {
        if (!userId) return null
        return await userUserInfoController.getUserInfos(userId)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'owner/userInfos', async (req:Request, res:Response) => {
    const userId = req?.userData?._id
    const { key, value, type } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IUserInfo>(async () => {
        if (!userId) return null
        return await userUserInfoController.saveUserInfo(userId, key, value, type)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'owner/userInfos/:userInfoId', async (req:Request, res:Response) => {
     const userId = req?.userData?._id
    const { userInfoId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IUserInfo>(async () => {
        if (!userId) return null
        return await userUserInfoController.getUserInfo(userId, userInfoId)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'owner/userInfos/:userInfoId', async (req:Request, res:Response) => {
    const userId = req?.userData?._id
    const { userInfoId } = req.params
    const { key, value, type } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IUserInfo>(async () => {
        if (!userId) return null
        return await userUserInfoController.updateUserInfo(userId, userInfoId, key, value, type)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'owner/userInfos/:userInfoId', async (req:Request, res:Response) => {
    const userId = req?.userData?._id
    const { userInfoId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IUserInfo>(async () => {
        if (!userId) return null
        return await userUserInfoController.deleteUserInfo( userId, userInfoId )
    })

    return res.status(statusCode).send(result)
})


// contact infos routes
router.get(env.RootApiEndpoint + 'owner/contactInfos', async (req:Request, res:Response) => {
    const userId = req?.userData?._id

    const [result, statusCode] = await ErrorHandler.execute<IContactInfo[]>(async () => {
        if (!userId) return null
        return await userContactInfoController.getContactInfos(userId)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'owner/contactInfos', async (req:Request, res:Response) => {
    const userId = req?.userData?._id
    const { type, value, countryCode, verified } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IContactInfo>(async () => {
        if (!userId) return null
        return await userContactInfoController.saveContactInfo(userId, type, value, countryCode, verified)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'owner/contactInfos/:contactInfoId', async (req:Request, res:Response) => {
    const userId = req?.userData?._id
    const { contactInfoId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IContactInfo>(async () => {
        if (!userId) return null
        return await userContactInfoController.getContactInfo(userId, contactInfoId)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'owner/contactInfos/:contactInfoId', async (req:Request, res:Response) => {
    const userId = req?.userData?._id
    const { contactInfoId } = req.params
    const { type, value, countryCode, verified } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IContactInfo>(async () => {
        if (!userId) return null
        return await userContactInfoController.updateContactInfo(userId, contactInfoId, type, value, countryCode, verified)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'owner/contactInfos/:contactInfoId', async (req:Request, res:Response) => {
    const userId = req?.userData?._id
    const { contactInfoId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IContactInfo>(async () => {
        if (!userId) return null
        return await userContactInfoController.deleteContactInfo( userId, contactInfoId )
    })

    return res.status(statusCode).send(result)
})


// passwords routes
router.get(env.RootApiEndpoint + 'owner/passwords', async (req:Request, res:Response) => {
    const userId = req?.userData?._id

    const [result, statusCode] = await ErrorHandler.execute<IPassword[]>(async () => {
        if (!userId) return null
        return await userPasswordController.getPasswords(userId)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'owner/passwords', async (req:Request, res:Response) => {
    const userId = req?.userData?._id
    const { currentPassword, newPassword } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IPassword>(async () => {
        if (!userId) return null
        return await userPasswordController.savePassword(userId, currentPassword, newPassword)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'owner/passwords/:passwordId', async (req:Request, res:Response) => {
    const userId = req?.userData?._id
    const { passwordId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IPassword>(async () => {
        if (!userId) return null
        return await userPasswordController.getPassword(userId, passwordId)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'owner/passwords/:passwordId', async (req:Request, res:Response) => {
    const userId = req?.userData?._id
    const { passwordId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IPassword>(async () => {
        if (!userId) return null
        return await userPasswordController.deletePassword( userId, passwordId )
    })

    return res.status(statusCode).send(result)
})


// limited transaction routes
router.get(env.RootApiEndpoint + 'owner/limitedTransactions', async (req:Request, res:Response) => {
    const userId = req?.userData?._id

    const [result, statusCode] = await ErrorHandler.execute<ILimitedTransaction[]>(async () => {
        if (!userId) return null
        return await userLimitedTransactionController.getLimitedTransactions(userId)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'owner/limitedTransactions/:limitedTransactionId', async (req:Request, res:Response) => {
    const userId = req?.userData?._id
    const { limitedTransactionId } = req.params

    console.log(limitedTransactionId)

    const [result, statusCode] = await ErrorHandler.execute<ILimitedTransaction>(async () => {
        if (!userId) return null
        return await userLimitedTransactionController.getLimitedTransaction(userId, limitedTransactionId)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'owner/limitedTransactions/:limitedTransactionId', async (req:Request, res:Response) => {
    const userId = req?.userData?._id
    const { limitedTransactionId } = req.params
    const {
        limit, attempts, key,
        value, expTime, recipient,
        disabled
    } = req.body

    const [result, statusCode] = await ErrorHandler.execute<ILimitedTransaction>(async () => {
        if (!userId) return null
        return await userLimitedTransactionController.updateLimitedTransaction(
            userId, limitedTransactionId,
            limit, attempts, key,
            value, expTime, recipient,
            disabled
        )
    })

    return res.status(statusCode).send(result)
})


// client device routes
router.get(env.RootApiEndpoint + 'owner/clientDevices', async (req:Request, res:Response) => {
    const userId = req?.userData?._id

    const [result, statusCode] = await ErrorHandler.execute<IClientDevice[]>(async () => {
        if (!userId) return null
        return await userClientDeviceController.getClientDevices(userId)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'owner/clientDevices', async (req:Request, res:Response) => {
    const userId = req?.userData?._id
    const { ua, disabled } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IClientDevice>(async () => {
        if (!userId) return null
        return await userClientDeviceController.saveClientDevice(userId, ua, disabled)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'owner/clientDevices/:clientDeviceId', async (req:Request, res:Response) => {
    const userId = req?.userData?._id
    const { clientDeviceId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IClientDevice>(async () => {
        if (!userId) return null
        return await userClientDeviceController.getClientDevice(userId, clientDeviceId)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'owner/clientDevices/:clientDeviceId', async (req:Request, res:Response) => {
    const userId = req?.userData?._id
    const { clientDeviceId } = req.params
    const { ua, disabled } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IClientDevice>(async () => {
        if (!userId) return null
        return await userClientDeviceController.updateClientDevice(userId, clientDeviceId, ua, disabled)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'owner/clientDevices/:clientDeviceId', async (req:Request, res:Response) => {
    const userId = req?.userData?._id
    const { clientDeviceId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IClientDevice>(async () => {
        if (!userId) return null
        return await userClientDeviceController.deleteClientDevice( userId, clientDeviceId )
    })

    return res.status(statusCode).send(result)
})


// client devices access token
router.get(env.RootApiEndpoint + 'owner/clientDevices/:clientDeviceId/accessTokens', async (req:Request, res:Response) => {
    const userId = req?.userData?._id
    const { clientDeviceId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IAccessToken[]>(async () => {
        if (!userId) return null
        return await userClientDeviceAccessTokenController.getClientDeviceAccessTokens(userId, clientDeviceId)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'owner/clientDevices/:clientDeviceId/accessTokens', async (req:Request, res:Response) => {
    const userId = req?.userData?._id
    const { clientDeviceId } = req.params
    const { jwt, ipAddress, disabled } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IAccessToken>(async () => {
        if (!userId) return null
        return await userClientDeviceAccessTokenController.saveClientDeviceAccessToken(userId, clientDeviceId, jwt, ipAddress, disabled)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'owner/clientDevices/:clientDeviceId/accessTokens/:accessTokenId', async (req:Request, res:Response) => {
    const userId = req?.userData?._id
    const { clientDeviceId, accessTokenId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IAccessToken>(async () => {
        if (!userId) return null
        return await userClientDeviceAccessTokenController.getClientDeviceAccessToken(userId, clientDeviceId, accessTokenId)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'owner/clientDevices/:clientDeviceId/accessTokens/:accessTokenId', async (req:Request, res:Response) => {
    const userId = req?.userData?._id
    const { clientDeviceId, accessTokenId } = req.params
    const { jwt, ipAddress, disabled } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IAccessToken>(async () => {
        if (!userId) return null
        return await userClientDeviceAccessTokenController.updateClientDeviceAccessToken(userId, clientDeviceId, accessTokenId, jwt, ipAddress, disabled)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'owner/clientDevices/:clientDeviceId/accessTokens/:accessTokenId', async (req:Request, res:Response) => {
    const userId = req?.userData?._id
    const { clientDeviceId, accessTokenId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IAccessToken>(async () => {
        if (!userId) return null
        return await userClientDeviceAccessTokenController.deleteClientDeviceAccessToken( userId, clientDeviceId, accessTokenId )
    })

    return res.status(statusCode).send(result)
})

// workspaces
router.get(env.RootApiEndpoint + 'owner/workspaces', async (req:Request, res:Response) => {
    const userId = req?.userData?._id
    const pageInfo = DataRequest.getPageInfoQuery(req.query)
    const query:{owner:string} = {owner: userId || ''}

    const [result, statusCode] = await ErrorHandler.execute<IListOutput<IWorkspace>>(async () => {
        if (!userId) return null
        return await workspaceController.getWorkspacesByPage(false, userId)(query, pageInfo)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'owner/workspaces', async (req:Request, res:Response) => {
    const userId = req?.userData?._id
    const { owner, name, description, disabled } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IWorkspace>(async () => {
        if (!userId) return null
        return await workspaceController.saveWorkspace(false, userId)(owner, name, description, disabled)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'owner/workspaces/:workspaceId', async (req:Request, res:Response) => {
    const userId = req?.userData?._id
    const { workspaceId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IWorkspace>(async () => {
        if (!userId) return null
        return await workspaceController.getWorkspace(false, userId)({_id: workspaceId})
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'owner/workspaces/:workspaceId', async (req:Request, res:Response) => {
    const userId = req?.userData?._id
    const { workspaceId } = req.params
    const { owner, name, description,disabled } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IWorkspace>(async () => {
        if (!userId) return null
        return await workspaceController.updateWorkspace(false, userId)(workspaceId, owner, name, description, disabled)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'owner/workspaces/:workspaceId', async (req:Request, res:Response) => {
    const userId = req?.userData?._id
    const { workspaceId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IWorkspace>(async () => {
        if (!userId) return null
        return await workspaceController.deleteWorkspace(false, userId)(workspaceId)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'owner/workspaces/:workspaceId/select', async (req:Request, res:Response) => {
    const userId = req?.userData?._id
    const { workspaceId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IWorkspace[]>(async () => {
        if (!userId) return null
        return await workspaceController.selectOwnerWorkspace(false, userId)(workspaceId, userId)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'owner/workspaces/:workspaceId/users', async (req:Request, res:Response) => {
    const userId = req?.userData?._id
    const { workspaceId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IUserRef[]>(async () => {
        if (!userId) return null
        return await workspaceUserController.getUserRefs(false, userId)(workspaceId)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'owner/workspaces/:workspaceId/users', async (req:Request, res:Response) => {
    const loggedUserId = req?.userData?._id
    const { workspaceId } = req.params
    const { userId, readAccess, writeAccess } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IUserRef>(async () => {
        if (!loggedUserId) return null
        return await workspaceUserController.saveUserRef(false, loggedUserId)(workspaceId, userId, readAccess, writeAccess)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'owner/workspaces/:workspaceId/users/:userRefId', async (req:Request, res:Response) => {
    const userId = req?.userData?._id
    const { workspaceId, userRefId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IUserRef>(async () => {
        if (!userId) return null
        return await workspaceUserController.getUserRef(false, userId)(workspaceId, userRefId)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'owner/workspaces/:workspaceId/users/:userRefId', async (req:Request, res:Response) => {
    const loggedUserId = req?.userData?._id
    const { workspaceId, userRefId } = req.params
    const { userId, readAccess, writeAccess } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IUserRef>(async () => {
        if (!loggedUserId) return null
        return await workspaceUserController.updateUserRef(false, loggedUserId)(workspaceId, userRefId, userId, readAccess, writeAccess)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'owner/workspaces/:workspaceId/users/:userRefId', async (req:Request, res:Response) => {
    const userId = req?.userData?._id
    const { workspaceId, userRefId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IUserRef>(async () => {
        if (!userId) return null
        return await workspaceUserController.deleteUserRef(false, userId)(workspaceId, userRefId)
    })

    return res.status(statusCode).send(result)
})


routerIdentity.addAppRouteObj(router)
export default router