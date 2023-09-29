import express from 'express'

import ErrorHandler from '../utilities/errorHandler'
import Config from '../utilities/config'
import { routerIdentity } from '../utilities/routerHandler'

import userClientDeviceController from '../controllers/userClientDeviceController'
import { IClientDevice } from '../dataSource/models/userModel'

const router = express.Router()
const env = Config.getEnv()

router.get(env.RootApiEndpoint + 'users/:userId/clientDevices', async (req, res) => {
    const { userId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IClientDevice[]>(async () => {
        return await userClientDeviceController.getClientDevices(userId)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'users/:userId/clientDevices', async (req, res) => {
    const { userId } = req.params
    const { ua, disabled } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IClientDevice>(async () => {
        return await userClientDeviceController.saveClientDevice(userId, ua, disabled)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'users/:userId/clientDevices/:clientDeviceId', async (req, res) => {
    const { userId, clientDeviceId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IClientDevice>(async () => {
        return await userClientDeviceController.getClientDevice(userId, clientDeviceId)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'users/:userId/clientDevices/:clientDeviceId', async (req, res) => {
   const { userId, clientDeviceId } = req.params
    const { ua, disabled } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IClientDevice>(async () => {
        return await userClientDeviceController.updateClientDevice(userId, clientDeviceId, ua, disabled)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'users/:userId/clientDevices/:clientDeviceId', async (req, res) => {
   const { userId, clientDeviceId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IClientDevice>(async () => {
        return await userClientDeviceController.deleteClientDevice( userId, clientDeviceId )
    })

    return res.status(statusCode).send(result)
})

routerIdentity.addAppRouteObj(router)
export default router