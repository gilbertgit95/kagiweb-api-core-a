import express from 'express'

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

router.post(env.RootApiEndpoint + 'signinOTP', async (req:any, res:any) => {
    const ua = req.userAgentInfo? req.userAgentInfo: null
    const ip = req.clientIp? req.clientIp: null
    const { username, key } = req.body

    const [result, statusCode] = await ErrorHandler.execute<{token?:string}>(async () => {
        return await authController.signinOTP(username, key, ua, ip)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'signup', async (req, res) => {

    return res.json({})
})

router.post(env.RootApiEndpoint + 'forgotPassword', async (req, res) => {

    return res.json({})
})

router.put(env.RootApiEndpoint + 'resetPassword', async (req, res) => {

    return res.json({})
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