import express, { Router } from 'express'
import mongoose from '../packages/mongoose'
import Config, {Env} from '../utilities/config'

const env = Config.getEnv()

class AppHandler {
    private route:Router = express.Router()
    private publicStaticRoutes:Router[] = []

    private publicMiddlewares:any[] = []
    private publicRoutes:Router[] = []

    private privateMiddlewares:any[] = []
    private privateRoutes:Router[] = []

    private postDBConnectionProcess:(() => void)[] = []

    public addPublicStaticRoute(route:Router) {
        this.publicStaticRoutes.push(route)
    }

    public addPublicMiddleware(route:any) {
        this.publicMiddlewares.push(route)
    }
    public addPublicRoute(route:Router) {
        this.publicRoutes.push(route)
    }

    public addPrivateMiddleware(route:any) {
        this.privateMiddlewares.push(route)
    }

    public addPrivateRoute(route:Router) {
        this.privateRoutes.push(route)
    }

    public addPostDBConnectionProcess(method:() => void) {
        this.postDBConnectionProcess.push(method)
    }

    public async executePostDBConnectionProcess() {
        for (let proc of this.postDBConnectionProcess) {
            await proc()
        }
    }

    public getEnv():Env {
        return Config.getEnv()
    }

    public async dbConnect() {
        await mongoose.connect(env.MongoURI? env.MongoURI: '', {
            dbName: env.DBName
        })
    }

    public getAppRoutes():Router {
        this.publicStaticRoutes.forEach(route => {
            this.route.use(route)
        })

        this.publicMiddlewares.forEach(route => {
            this.route.use(route)
        })
        this.publicRoutes.forEach(route => {
            this.route.use(route)
        })

        this.privateMiddlewares.forEach(route => {
            this.route.use(route)
        })
        this.privateRoutes.forEach(route => {
            this.route.use(route)
        })
        return this.route
    }

}

export default AppHandler