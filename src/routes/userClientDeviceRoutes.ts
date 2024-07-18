import express from 'express'

import ErrorHandler from '../utilities/errorHandler'
import Config from '../utilities/config'
import routerIdentity from '../utilities/routerIdentity'

import userClientDeviceController from '../controllers/userClientDeviceController'
import { IClientDevice } from '../dataSource/models/userModel'

const router = express.Router()
const env = Config.getEnv()

router.get(env.RootApiEndpoint + 'accounts/:accountId/clientDevices', async (req, res) => {
    const { accountId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IClientDevice[]>(async () => {
        return await userClientDeviceController.getClientDevices(accountId)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'accounts/:accountId/clientDevices', async (req, res) => {
    const { accountId } = req.params
    const { ua, description, disabled } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IClientDevice>(async () => {
        return await userClientDeviceController.saveClientDevice(accountId, ua, description, disabled)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'accounts/:accountId/clientDevices/:clientDeviceId', async (req, res) => {
    const { accountId, clientDeviceId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IClientDevice>(async () => {
        return await userClientDeviceController.getClientDevice(accountId, clientDeviceId)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'accounts/:accountId/clientDevices/:clientDeviceId', async (req, res) => {
   const { accountId, clientDeviceId } = req.params
    const { ua, description, disabled } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IClientDevice>(async () => {
        return await userClientDeviceController.updateClientDevice(accountId, clientDeviceId, ua, description, disabled)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'accounts/:accountId/clientDevices/:clientDeviceId', async (req, res) => {
   const { accountId, clientDeviceId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IClientDevice>(async () => {
        return await userClientDeviceController.deleteClientDevice( accountId, clientDeviceId )
    })

    return res.status(statusCode).send(result)
})

routerIdentity.addAppRouteObj(router)
export default router