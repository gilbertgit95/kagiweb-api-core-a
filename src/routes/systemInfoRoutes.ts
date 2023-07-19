import express from 'express'

import Config from '../utilities/config'
import systemInfoController, { ISystemInfo } from '../controllers/systemInfoController'

const router = express.Router()
const env = Config.getEnv()

router.get(env.RootApiCoreEndpoint + 'systemInfo', async (req, res) => {
  return res.json(systemInfoController.details())
})

export default router