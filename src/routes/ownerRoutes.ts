import express from 'express'

// import UserModel, { IUser } from '../dataSource/models/userModel'
import ErrorHandler from '../utilities/errorHandler'
import DataRequest, {IListOutput} from '../utilities/dataQuery'
import Config from '../utilities/config'
import routerIdentity from '../utilities/routerIdentity'
import { AppRequest } from '../utilities/globalTypes'

import userController from '../controllers/userController'

import {
    IUser, IRoleRef, IUserInfo, IContactInfo,
    IPassword, ILimitedTransaction, IClientDevice, IAccessToken
} from '../dataSource/models/userModel'

const router = express.Router()
const env = Config.getEnv()

router.get(env.RootApiEndpoint + 'owner/', async (req:any, res) => {
    const userId = req?.userData?._id
    const [result, statusCode] = await ErrorHandler.execute<IUser>(async () => {
        return await userController.getUser({_id: userId})
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'owner/', async (req:any, res) => {
    const userId = req?.userData?._id
    const { username, disabled, verified } = req.body

    const [result, statusCode] = await ErrorHandler.execute<IUser>(async () => {
        return await userController.updateUser(userId, username, disabled, verified)
    })

    return res.status(statusCode).send(result)
})

routerIdentity.addAppRouteObj(router)
export default router