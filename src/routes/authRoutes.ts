import express from 'express'

// import UserModel, { IUser } from '../dataSource/models/userModel'
import Config from '../utilities/config'
import ErrorHandler from '../utilities/errorHandler'

const env = Config.getEnv()
const router = express.Router()

router.post(env.RootApiEndpoint + 'signin', async (req, res) => {
    // get username and password from the request query
    console.log(req.body)

    // get user data

    // get request user agent info

    // get request ip address

    // call signin controller with the above parameters

    const [result, statusCode] = await ErrorHandler.execute<string>(async () => {
        return null
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