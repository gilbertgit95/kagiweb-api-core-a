import dotenv from 'dotenv'
dotenv.config()
import express from 'express'

import appHandler, { appEvents } from './app'

const env = appHandler.getEnv()
const appRoutes = appHandler.getAppRoutes()
const app = express().use(appRoutes)

// bind app callbacks
appEvents.on('send-signin-otp', (data) => {
    console.log('send-signin-otp has been emited!: ', data)
})
appEvents.on('send-reset-password-otp', (data) => {
    console.log('send-reset-password-otp has been emited!: ', data)
})
appEvents.on('signup', (data) => {
    console.log('signup has been emited!: ', data)
})

// start express application
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