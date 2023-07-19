import express from 'express'

import UserModel, { IUser } from '../dataSource/models/userModel'
import Config from '../utilities/config'

const env = Config.getEnv()
const router = express.Router()

router.post(env.RootApiCoreEndpoint + 'signin', async (req, res) => {
    // get username and password from the request query
    console.log(req.body)

    // get user data

    // get request user agent info

    // get request ip address

    // call signin controller with the above parameters

    return res.json({})
})

router.post(env.RootApiCoreEndpoint + 'signinOTP', async (req, res) => {

    return res.json({})
})

router.post(env.RootApiCoreEndpoint + 'signout', async (req, res) => {

    return res.json({})
})

router.post(env.RootApiCoreEndpoint + 'signup', async (req, res) => {

    return res.json({})
})

router.post(env.RootApiCoreEndpoint + 'forgotPassword', async (req, res) => {

    return res.json({})
})

router.post(env.RootApiCoreEndpoint + 'resetPassword', async (req, res) => {

    return res.json({})
})

export default router