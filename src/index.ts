import mongoose from 'mongoose'
import express from 'express'
import appRouteHandler from './app'
import Config from './utilities/config'
import routerIdentity from './utilities/routerIdentity'

const env = Config.getEnv()
const appRoutes = appRouteHandler.getConsolidatedRoutes()
const app = express().use(appRoutes)

app.listen(env.AppPort, async () => {
    try {
        await mongoose.connect(env.MongoURI? env.MongoURI: '', {
            dbName: env.DBName
        })
        console.log(`- Successfully connected to database`)
        await routerIdentity.syncAppRoutes()
        console.log(`- Sync the application routes to the database`)
    } catch (err) {
        console.log(`!Error, was not able to connect to the mongo database: ${ err }`)
        // throw(err)
    }
    console.log(`- Server is running on port: ${ env.AppPort }`)
})