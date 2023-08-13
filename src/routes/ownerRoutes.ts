import express from 'express'

import {AppRequest } from '../utilities/globalTypes'
import Config from '../utilities/config'
import ErrorHandler from '../utilities/errorHandler'
import authController from '../controllers/authController'

import { IUser } from '../dataSource/models/userModel'

const env = Config.getEnv()
const router = express.Router()

router.get(env.RootApiEndpoint + 'owner', async (req, res) => {

    return res.json({})
})

export default router