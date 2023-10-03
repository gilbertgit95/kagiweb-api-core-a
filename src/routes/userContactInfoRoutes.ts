import express from 'express'

import ErrorHandler from '../utilities/errorHandler'
import Config from '../utilities/config'
import { routerIdentity } from '../utilities/appHandler'

import userContactInfoController from '../controllers/userContactInfoController'
import { IContactInfo } from '../dataSource/models/userModel'

const router = express.Router()
const env = Config.getEnv()

router.get(env.RootApiEndpoint + 'users/:userId/contactInfos', async (req, res) => {
    const { userId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IContactInfo[]>(async () => {
        return await userContactInfoController.getContactInfos(userId)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'users/:userId/contactInfos', async (req, res) => {
    const { userId } = req.params
    const { type, value, countryCode, verified } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IContactInfo>(async () => {
        return await userContactInfoController.saveContactInfo(userId, type, value, countryCode, verified)
    })

    return res.status(statusCode).send(result)
})

router.get(env.RootApiEndpoint + 'users/:userId/contactInfos/:contactInfoId', async (req, res) => {
    const { userId, contactInfoId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IContactInfo>(async () => {
        return await userContactInfoController.getContactInfo(userId, contactInfoId)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'users/:userId/contactInfos/:contactInfoId', async (req, res) => {
    const { userId, contactInfoId } = req.params
    const { type, value, countryCode, verified } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IContactInfo>(async () => {
        return await userContactInfoController.updateContactInfo(userId, contactInfoId, type, value, countryCode, verified)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'users/:userId/contactInfos/:contactInfoId', async (req, res) => {
   const { userId, contactInfoId } = req.params

    const [result, statusCode] = await ErrorHandler.execute<IContactInfo>(async () => {
        return await userContactInfoController.deleteContactInfo( userId, contactInfoId )
    })

    return res.status(statusCode).send(result)
})

routerIdentity.addAppRouteObj(router)
export default router