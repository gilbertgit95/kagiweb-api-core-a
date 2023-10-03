import express from 'express'

// import UserModel, { IUser } from '../dataSource/models/userModel'
import ErrorHandler from '../utilities/errorHandler'
import DataRequest, {IListOutput} from '../utilities/dataQuery'
import Config from '../utilities/config'
import { routerIdentity } from '../utilities/appHandler'

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
        return await userController.updateUser(userId, username, disabled, verified)
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

routerIdentity.addAppRouteObj(router)
export default router