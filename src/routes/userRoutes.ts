import express from 'express'

// import UserModel, { IUser } from '../dataSource/models/userModel'
import ErrorHandler from '../utilities/errorHandler'
import DataRequest, {IListOutput} from '../utilities/dataQuery'
import Config from '../utilities/config'
import routerIdentity from '../utilities/routerIdentity'

import userController from '../controllers/userController'
import { IUser } from '../dataSource/models/userModel'

const router = express.Router()
const env = Config.getEnv()

router.get(env.RootApiEndpoint + 'users', async (req, res) => {
    const pageInfo = DataRequest.getPageInfoQuery(req.query)

    const [result, statusCode] = await ErrorHandler.execute<IListOutput<IUser>>(async () => {
        return await userController.getUsersByPage({}, pageInfo)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'users', async (req, res) => {
    const { username, disabled, verified } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IUser>(async () => {
        return await userController.saveUser(username, disabled, verified)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'users/:userId', async (req, res) => {
    const { userId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IUser>(async () => {
        return await userController.getUser({_id: userId})
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'users/:userId', async (req, res) => {
    const { userId } = req.params
    const { username, disabled, verified } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IUser>(async () => {
        if (userId) {
            return await userController.updateUser(userId, username, disabled, verified)
        }
        return null
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'users/:userId', async (req, res) => {
    const { userId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IUser>(async () => {
        return await userController.deleteUser(userId)
    })

    return res.status(statusCode).send(result)
})

// routes for owner user info
router.get(env.RootApiEndpoint + 'users/:userId/userInfo', async (req, res) => {
    return res.json({})
})
router.post(env.RootApiEndpoint + 'users/:userId/userInfo', async (req, res) => {
    return res.json({})
})
router.get(env.RootApiEndpoint + 'users/:userId/userInfo/:userInfoId', async (req, res) => {
    return res.json({})
})
router.put(env.RootApiEndpoint + 'users/:userId/userInfo/:userInfoId', async (req, res) => {
    return res.json({})
})
router.delete(env.RootApiEndpoint + 'users/:userId/userInfo/:userInfoId', async (req, res) => {
    return res.json({})
})

// routes for users/:userId contact info
router.get(env.RootApiEndpoint + 'users/:userId/contactInfo', async (req, res) => {
    return res.json({})
})
router.post(env.RootApiEndpoint + 'users/:userId/contactInfo', async (req, res) => {
    return res.json({})
})
router.get(env.RootApiEndpoint + 'users/:userId/contactInfo/:contactInfoId', async (req, res) => {
    return res.json({})
})
router.put(env.RootApiEndpoint + 'users/:userId/contactInfo/:contactInfoId', async (req, res) => {
    return res.json({})
})
router.delete(env.RootApiEndpoint + 'users/:userId/contactInfo/:contactInfoId', async (req, res) => {
    return res.json({})
})

// routes for users/:userId roles
router.get(env.RootApiEndpoint + 'users/:userId/roles', async (req, res) => {
    return res.json({})
})
router.post(env.RootApiEndpoint + 'users/:userId/roles', async (req, res) => {
    return res.json({})
})
router.get(env.RootApiEndpoint + 'users/:userId/roles/:roleId', async (req, res) => {
    return res.json({})
})
router.put(env.RootApiEndpoint + 'users/:userId/roles/:roleId', async (req, res) => {
    return res.json({})
})
router.delete(env.RootApiEndpoint + 'users/:userId/roles/:roleId', async (req, res) => {
    return res.json({})
})

// routes for users/:userId passwords
router.get(env.RootApiEndpoint + 'users/:userId/passwords', async (req, res) => {
    return res.json({})
})
router.post(env.RootApiEndpoint + 'users/:userId/passwords', async (req, res) => {
    return res.json({})
})
router.get(env.RootApiEndpoint + 'users/:userId/passwords/:passwordId', async (req, res) => {
    return res.json({})
})
router.put(env.RootApiEndpoint + 'users/:userId/passwords/:passwordId', async (req, res) => {
    return res.json({})
})
router.delete(env.RootApiEndpoint + 'users/:userId/passwords/:passwordId', async (req, res) => {
    return res.json({})
})

// routes for users/:userId limited transactions
router.get(env.RootApiEndpoint + 'users/:userId/limitedTransactions', async (req, res) => {
    return res.json({})
})
router.post(env.RootApiEndpoint + 'users/:userId/limitedTransactions', async (req, res) => {
    return res.json({})
})
router.get(env.RootApiEndpoint + 'users/:userId/limitedTransactions/:ltId', async (req, res) => {
    return res.json({})
})
router.put(env.RootApiEndpoint + 'users/:userId/limitedTransactions/:ltId', async (req, res) => {
    return res.json({})
})
router.delete(env.RootApiEndpoint + 'users/:userId/limitedTransactions/:ltId', async (req, res) => {
    return res.json({})
})

// routes for users/:userId devices
router.get(env.RootApiEndpoint + 'users/:userId/devices', async (req, res) => {
    return res.json({})
})
router.post(env.RootApiEndpoint + 'users/:userId/devices', async (req, res) => {
    return res.json({})
})
router.get(env.RootApiEndpoint + 'users/:userId/devices/:deviceId', async (req, res) => {
    return res.json({})
})
router.put(env.RootApiEndpoint + 'users/:userId/devices/:deviceId', async (req, res) => {
    return res.json({})
})
router.delete(env.RootApiEndpoint + 'users/:userId/devices/:deviceId', async (req, res) => {
    return res.json({})
})

// routes for users/:userId device access token
router.get(env.RootApiEndpoint + 'users/:userId/devices/:deviceId/tokens', async (req, res) => {
    return res.json({})
})
router.post(env.RootApiEndpoint + 'users/:userId/devices/:deviceId/tokens', async (req, res) => {
    return res.json({})
})
router.get(env.RootApiEndpoint + 'users/:userId/devices/:deviceId/tokens/:tokenId', async (req, res) => {
    return res.json({})
})
router.put(env.RootApiEndpoint + 'users/:userId/devices/:deviceId/tokens/:tokenId', async (req, res) => {
    return res.json({})
})
router.delete(env.RootApiEndpoint + 'users/:userId/devices/:deviceId/tokens/:tokenId', async (req, res) => {
    return res.json({})
})

routerIdentity.addAppRouteObj(router)
export default router