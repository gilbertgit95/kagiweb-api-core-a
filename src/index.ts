import dotenv from 'dotenv'
dotenv.config()
import express from 'express'

import appHandler, { appEvents } from './app'
// import Encryption from './utilities/encryption'

const env = appHandler.getEnv()
const appRoutes = appHandler.getAppRoutes()
const app = express().use(appRoutes)

// bind app event callbacks
appEvents.on('otp', (data) => {
    if (data.module === 'signin') {
        console.log(`otp: signin, ${ data.lt.key } key will be sent to ${ data.lt.recipient }`)
        //  do something you want
    } else if (data.module === 'reset-password') {
        console.log(`otp: reset-password, ${ data.lt.key } key will be sent to ${ data.lt.recipient }`)
        //  do something you want
    }
})

appEvents.on('user-created', (data) => {
    if (data.module === 'signup') {
        console.log(`user-created, module: ${ data.module }, username: ${ data.createdUser?.username }`)
        //  do something you want
    } else if (data.module === 'admin') {
        console.log(`user-created, module: ${ data.module }, defaut password is: ${ data.password }, username: ${ data.createdUser?.username }`)
        //  do something you want
    }
})

appEvents.on('user-changed', (data) => {
    if (data.property === 'username') {
        console.log(`user-changed: ${ data.property }, value: ${ data.value }, previousValue: ${ data.previousValue }, username: ${ data.changedUser?.username }`)
        //  do something you want
    } else if (data.property === 'disabled') {
        console.log(`user-changed: ${ data.property }, value: ${ data.value }, previousValue: ${ data.previousValue }, username: ${ data.changedUser?.username }`)
        //  do something you want
    } else if (data.property === 'verified') {
        console.log(`user-changed: ${ data.property }, value: ${ data.value }, previousValue: ${ data.previousValue }, username: ${ data.changedUser?.username }`)
        //  do something you want
    }
})

appEvents.on('workspace-update', (data) => {
    if (data.action === 'add') {
        console.log(`workspace-update: ${ data.assignedUser.username } was added to ${ data.user.username } -> ${ data.workspace.name }`)
        //  do something you want
    } else if (data.action === 'remove') {
        console.log(`workspace-update:  ${ data.assignedUser.username } was removed from ${ data.user.username } -> ${ data.workspace.name }`)
        //  do something you want
    }
})

// start express application
app.listen(env.AppPort, async () => {
    // const jwtDoc = await Encryption.generateJWT({userId: 'test'})
    // const exp = (await Encryption.verifyJWT<{userId:string}>(jwtDoc))?.exp
    // console.log(jwtDoc, exp? new Date(exp * 1e3): undefined)

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