import express from 'express'

import {AppRequest } from '../utilities/globalTypes'
import Config from '../utilities/config'
import ErrorHandler from '../utilities/errorHandler'
import authController from '../controllers/authController'

import { IUser } from '../dataSource/models/userModel'

const env = Config.getEnv()
const router = express.Router()

router.post(env.RootApiEndpoint + 'signin', async (req, res) => {
    const { username, password } = req.body
    // const ua = req.userAgentInfo? req.userAgentInfo: null

    const [result, statusCode] = await ErrorHandler.execute<String>(async () => {
        return await authController.signin(username, password, null)
    })

    return res.status(statusCode).send(result)
})

router.post(env.RootApiEndpoint + 'signinOTP', async (req, res) => {

    return res.json({})
})

router.post(env.RootApiEndpoint + 'signout', async (req, res) => {

    return res.json({})
})

router.post(env.RootApiEndpoint + 'signup', async (req, res) => {

    return res.json({})
})

router.post(env.RootApiEndpoint + 'forgotPassword', async (req, res) => {

    return res.json({})
})

router.post(env.RootApiEndpoint + 'resetPassword', async (req, res) => {

    return res.json({})
})

export default router