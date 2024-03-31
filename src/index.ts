import dotenv from 'dotenv'
dotenv.config()
import express from 'express'

import appHandler, { appEvents } from './app'

const env = appHandler.getEnv()
const appRoutes = appHandler.getAppRoutes()
const app = express().use(appRoutes)

// bind app event callbacks
appEvents.on('otp-signin', (data) => {
    // console.log('otp-signin has been emited!: ', data)
    console.log(`otp-signin, ${ data.lt.key } key will be sent to ${ data.lt.recipient }`)
})
appEvents.on('otp-reset-pass', (data) => {
    // console.log('otp-reset-pass has been emited!: ', data)
    console.log(`otp-reset-pass, ${ data.lt.key } key will be sent to ${ data.lt.recipient }`)
})

appEvents.on('user-created', (data) => {
    if (data.module === 'signup') {
        console.log(`user-created, module: ${ data.module }, username: ${ data.createdUser?.username }`)
    } else if (data.module === 'admin') {
        console.log(`user-created, module: ${ data.module }, defaut password is: ${ data.password }, username: ${ data.createdUser?.username }`)
    }
})

appEvents.on('user-changed', (data) => {
    if (data.property === 'disabled') {
        console.log(`user-changed: ${ data.property }, value: ${ data.value }, by: ${ data.user?.username }`)
        //  do something you want
    } else if (data.module === 'verified') {
        console.log(`user-changed: ${ data.property }, value: ${ data.value }, by: ${ data.user?.username }`)
        //  do something you want
    }
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