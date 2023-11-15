import express, {Request} from 'express'

// import {AppRequest } from '../utilities/globalTypes'
import Config from '../utilities/config'
import ErrorHandler from '../utilities/errorHandler'
import authController from '../controllers/authController'

// import { IUser } from '../dataSource/models/userModel'

const env = Config.getEnv()
const router = express.Router()

router.post(env.RootApiEndpoint + 'signin', async (req:any, res:any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    const ua = req.userAgentInfo? req.userAgentInfo: null
    const ip = req.clientIp? req.clientIp: null
    const { username, password } = req.body

    // console.log(username, password)

    const [result, statusCode] = await ErrorHandler.execute<{token?:string}>(async () => {
        return await authController.signin(username, password, ua, ip)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'signinOTP', async (req:any, res) => {
    const ua = req.userAgentInfo? req.userAgentInfo: null
    const ip = req.clientIp? req.clientIp: null
    const { username, key } = req.body

    const [result, statusCode] = await ErrorHandler.execute<{token?:string}>(async () => {
        return await authController.signinOTP(username, key, ua, ip)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'signup', async (req, res) => {
    const { username, password, email, phone } = req.body

    const [result, statusCode] = await ErrorHandler.execute<{message:string}>(async () => {
        return await authController.signup(username, password, email, phone)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'forgotPassword', async (req, res) => {

    const { username } = req.body

    const [result, statusCode] = await ErrorHandler.execute<{username:string}>(async () => {
        return await authController.forgotPassword(username)
    })

    return res.status(statusCode).send(result)
})

router.put(env.RootApiEndpoint + 'resetPassword', async (req, res) => {

    const { username, key, newPassword } = req.body

    const [result, statusCode] = await ErrorHandler.execute<{message:string}>(async () => {
        return await authController.resetPassword(username, key, newPassword)
    })

    return res.status(statusCode).send(result)
})

router.delete(env.RootApiEndpoint + 'signout', async (req:any, res:any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    const authorization = req.headers.authorization
    const ua = req.userAgentInfo? req.userAgentInfo: null
    
    const [result, statusCode] = await ErrorHandler.execute<{message:string}>(async () => {
        return await authController.signout(ua, authorization)
    })

    return res.status(statusCode).send(result)
})

export default router