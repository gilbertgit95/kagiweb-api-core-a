import express from 'express'

import Config from '../utilities/config'
import ErrorHandler from '../utilities/errorHandler'
import systemInfoController, {ISystemInfo} from '../controllers/systemInfoController'

const router = express.Router()
const env = Config.getEnv()

router.get(env.RootApiEndpoint + 'systemInfo', async (req, res) => {

  const [result, statusCode] = await ErrorHandler.execute<ISystemInfo>(async () => {
    return await systemInfoController.details()
  })

  return res.status(statusCode).send(result)
})

export default router