import dotenv from 'dotenv'
dotenv.config()
import express from 'express'

import appHandler from './app'

const env = appHandler.getEnv()
const appRoutes = appHandler.getAppRoutes()
const app = express().use(appRoutes)

app.listen(env.AppPort, async () => {
    try {
        await appHandler.dbConnect()
        console.log(`- Successfully connected to database`)
        await appHandler.executePostDBConnectionProcess()
        console.log(`- Execute post db conection process`)
    } catch (err) {
        console.log(`!Error, was not able to connect to the mongo database: ${ err }`)
    }
    console.log(`- Server is running on port: ${ env.AppPort }`)
})