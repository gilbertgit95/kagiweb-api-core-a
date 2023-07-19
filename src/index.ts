import mongoose from 'mongoose'

import app from './app'
import Config from './utilities/config'

const env = Config.getEnv()

app.listen(env.AppPort, async () => {
    try {
        await mongoose.connect(env.MongoURI? env.MongoURI: '', {
            dbName: env.DBName
        })
        console.log(`- Successfully connected to database`)
    } catch (err) {
        console.log(`!Error, was not able to connect to the mongo database: ${ err }`)
        // throw(err)
    }
    console.log(`- Server is running on port: ${ env.AppPort }`)
})