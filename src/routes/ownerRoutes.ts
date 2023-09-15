import express from 'express'

// import UserModel, { IUser } from '../dataSource/models/userModel'
import ErrorHandler from '../utilities/errorHandler'
import DataRequest, {IListOutput} from '../utilities/dataQuery'
import Config from '../utilities/config'
import routerIdentity from '../utilities/routerIdentity'
import { AppRequest } from '../utilities/globalTypes'

import userController from '../controllers/userController'
import userRoleController from '../controllers/userRoleController'
import userUserInfoController from '../controllers/userUserInfoController'
import userContactInfoController from '../controllers/userContactInfoController'
import userPasswordController from '../controllers/userPasswordController'
import userLimitedTransactionController from '../controllers/userLimitedTransactionController'
import userClientDeviceController from '../controllers/userClientDeviceController'
import userClientDeviceAccessTokenController from '../controllers/userClientDeviceAccessTokenController'

import {
    IUser, IRoleRef, IUserInfo, IContactInfo,
    IPassword, ILimitedTransaction, IClientDevice, IAccessToken
} from '../dataSource/models/userModel'

const router = express.Router()
const env = Config.getEnv()


// root owner paths
router.get(env.RootApiEndpoint + 'owner', async (req:any, res) => {
    const userId = req?.userData?._id
    const [result, statusCode] = await ErrorHandler.execute<IUser>(async () => {
        return await userController.getUser({_id: userId})
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'owner', async (req:any, res) => {
    const userId = req?.userData?._id
    const { username, disabled, verified } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IUser>(async () => {
        return await userController.updateUser(userId, username, disabled, verified)
    })

    return res.status(statusCode).send(result)
})


// owner roles routes
router.get(env.RootApiEndpoint + 'owner/roles', async (req:any, res) => {
    const userId = req?.userData?._id

    const [result, statusCode] = await ErrorHandler.execute<IRoleRef[]>(async () => {
        return await userRoleController.getRoleRefs(userId)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'owner/roles/:roleRefId', async (req:any, res) => {
    const userId = req?.userData?._id
    const { roleRefId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IRoleRef>(async () => {
        return await userRoleController.getRoleRef(userId, roleRefId)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'owner/roles', async (req:any, res) => {
    const userId = req?.userData?._id
    const { roleId, isActive } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IRoleRef>(async () => {
        return await userRoleController.saveRoleRef(userId, roleId, isActive)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'owner/roles/:roleRefId', async (req:any, res) => {
    const userId = req?.userData?._id
    const { roleRefId } = req.params
    const { roleId, isActive } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IRoleRef>(async () => {
        return await userRoleController.updateRoleRef(userId, roleRefId, roleId, isActive)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'owner/roles/:roleRefId', async (req:any, res) => {
    const userId = req?.userData?._id
    const { roleRefId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IRoleRef>(async () => {
        return await userRoleController.deleteRoleRef(userId, roleRefId)
    })

    return res.status(statusCode).send(result)
})


// owner userInfo routes
router.get(env.RootApiEndpoint + 'owner/userInfos', async (req:any, res) => {
    const userId = req?.userData?._id

    const [result, statusCode] = await ErrorHandler.execute<IUserInfo[]>(async () => {
        return await userUserInfoController.getUserInfos(userId)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'owner/userInfos', async (req:any, res) => {
    const userId = req?.userData?._id
    const { key, value, type } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IUserInfo>(async () => {
        return await userUserInfoController.saveUserInfo(userId, key, value, type)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'owner/userInfos/:userInfoId', async (req:any, res) => {
     const userId = req?.userData?._id
    const { userInfoId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IUserInfo>(async () => {
        return await userUserInfoController.getUserInfo(userId, userInfoId)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'owner/userInfos/:userInfoId', async (req:any, res) => {
    const userId = req?.userData?._id
    const { userInfoId } = req.params
    const { key, value, type } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IUserInfo>(async () => {
        return await userUserInfoController.updateUserInfo(userId, userInfoId, key, value, type)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'owner/userInfos/:userInfoId', async (req:any, res) => {
    const userId = req?.userData?._id
    const { userInfoId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IUserInfo>(async () => {
        return await userUserInfoController.deleteUserInfo( userId, userInfoId )
    })

    return res.status(statusCode).send(result)
})


// contact infos routes
router.get(env.RootApiEndpoint + 'owner/contactInfos', async (req:any, res) => {
    const userId = req?.userData?._id

    const [result, statusCode] = await ErrorHandler.execute<IContactInfo[]>(async () => {
        return await userContactInfoController.getContactInfos(userId)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'owner/contactInfos', async (req:any, res) => {
    const userId = req?.userData?._id
    const { type, value, countryCode, verified } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IContactInfo>(async () => {
        return await userContactInfoController.saveContactInfo(userId, type, value, countryCode, verified)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'owner/contactInfos/:contactInfoId', async (req:any, res) => {
    const userId = req?.userData?._id
    const { contactInfoId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IContactInfo>(async () => {
        return await userContactInfoController.getContactInfo(userId, contactInfoId)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'owner/contactInfos/:contactInfoId', async (req:any, res) => {
    const userId = req?.userData?._id
    const { contactInfoId } = req.params
    const { type, value, countryCode, verified } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IContactInfo>(async () => {
        return await userContactInfoController.updateContactInfo(userId, contactInfoId, type, value, countryCode, verified)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'owner/contactInfos/:contactInfoId', async (req:any, res) => {
    const userId = req?.userData?._id
    const { contactInfoId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IContactInfo>(async () => {
        return await userContactInfoController.deleteContactInfo( userId, contactInfoId )
    })

    return res.status(statusCode).send(result)
})


// passwords routes
router.get(env.RootApiEndpoint + 'owner/passwords', async (req:any, res) => {
    const userId = req?.userData?._id

    const [result, statusCode] = await ErrorHandler.execute<IPassword[]>(async () => {
        return await userPasswordController.getPasswords(userId)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'owner/passwords', async (req:any, res) => {
    const userId = req?.userData?._id
    const { currentPassword, newPassword } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IPassword>(async () => {
        return await userPasswordController.savePassword(userId, currentPassword, newPassword)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'owner/passwords/:passwordId', async (req:any, res) => {
    const userId = req?.userData?._id
    const { passwordId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IPassword>(async () => {
        return await userPasswordController.getPassword(userId, passwordId)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'owner/passwords/:passwordId', async (req:any, res) => {
    const userId = req?.userData?._id
    const { passwordId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IPassword>(async () => {
        return await userPasswordController.deletePassword( userId, passwordId )
    })

    return res.status(statusCode).send(result)
})


// limited transaction routes
router.get(env.RootApiEndpoint + 'owner/limitedTransactions', async (req:any, res) => {
    const userId = req?.userData?._id

    const [result, statusCode] = await ErrorHandler.execute<ILimitedTransaction[]>(async () => {
        return await userLimitedTransactionController.getLimitedTransactions(userId)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'owner/limitedTransactions/:limitedTransactionId', async (req:any, res) => {
    const userId = req?.userData?._id
    const { limitedTransactionId } = req.params

    console.log(limitedTransactionId)

    const [result, statusCode] = await ErrorHandler.execute<ILimitedTransaction>(async () => {
        return await userLimitedTransactionController.getLimitedTransaction(userId, limitedTransactionId)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'owner/limitedTransactions/:limitedTransactionId', async (req:any, res) => {
    const userId = req?.userData?._id
    const { limitedTransactionId } = req.params
    const {
        limit, attempts, key,
        value, expTime, recipient,
        disabled
    } = req.body

    const [result, statusCode] = await ErrorHandler.execute<ILimitedTransaction>(async () => {
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
router.get(env.RootApiEndpoint + 'owner/clientDevices', async (req:any, res) => {
    const userId = req?.userData?._id

    const [result, statusCode] = await ErrorHandler.execute<IClientDevice[]>(async () => {
        return await userClientDeviceController.getClientDevices(userId)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'owner/clientDevices', async (req:any, res) => {
    const userId = req?.userData?._id
    const { ua, disabled } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IClientDevice>(async () => {
        return await userClientDeviceController.saveClientDevice(userId, ua, disabled)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'owner/clientDevices/:clientDeviceId', async (req:any, res) => {
    const userId = req?.userData?._id
    const { clientDeviceId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IClientDevice>(async () => {
        return await userClientDeviceController.getClientDevice(userId, clientDeviceId)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'owner/clientDevices/:clientDeviceId', async (req:any, res) => {
    const userId = req?.userData?._id
    const { clientDeviceId } = req.params
    const { ua, disabled } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IClientDevice>(async () => {
        return await userClientDeviceController.updateClientDevice(userId, clientDeviceId, ua, disabled)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'owner/clientDevices/:clientDeviceId', async (req:any, res) => {
    const userId = req?.userData?._id
    const { clientDeviceId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IClientDevice>(async () => {
        return await userClientDeviceController.deleteClientDevice( userId, clientDeviceId )
    })

    return res.status(statusCode).send(result)
})


// client devices access token
router.get(env.RootApiEndpoint + 'owner/clientDevices/:clientDeviceId/accessTokens', async (req:any, res) => {
    const userId = req?.userData?._id
    const { clientDeviceId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IAccessToken[]>(async () => {
        return await userClientDeviceAccessTokenController.getClientDeviceAccessTokens(userId, clientDeviceId)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'owner/clientDevices/:clientDeviceId/accessTokens', async (req:any, res) => {
    const userId = req?.userData?._id
    const { clientDeviceId } = req.params
    const { jwt, ipAddress, disabled } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IAccessToken>(async () => {
        return await userClientDeviceAccessTokenController.saveClientDeviceAccessToken(userId, clientDeviceId, jwt, ipAddress, disabled)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'owner/clientDevices/:clientDeviceId/accessTokens/:accessTokenId', async (req:any, res) => {
    const userId = req?.userData?._id
    const { clientDeviceId, accessTokenId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IAccessToken>(async () => {
        return await userClientDeviceAccessTokenController.getClientDeviceAccessToken(userId, clientDeviceId, accessTokenId)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'owner/clientDevices/:clientDeviceId/accessTokens/:accessTokenId', async (req:any, res) => {
    const userId = req?.userData?._id
    const { clientDeviceId, accessTokenId } = req.params
    const { jwt, ipAddress, disabled } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IAccessToken>(async () => {
        return await userClientDeviceAccessTokenController.updateClientDeviceAccessToken(userId, clientDeviceId, accessTokenId, jwt, ipAddress, disabled)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'owner/clientDevices/:clientDeviceId/accessTokens/:accessTokenId', async (req:any, res) => {
    const userId = req?.userData?._id
    const { clientDeviceId, accessTokenId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IAccessToken>(async () => {
        return await userClientDeviceAccessTokenController.deleteClientDeviceAccessToken( userId, clientDeviceId, accessTokenId )
    })

    return res.status(statusCode).send(result)
})

routerIdentity.addAppRouteObj(router)
export default router