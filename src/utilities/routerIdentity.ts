import UrlPattern from 'url-pattern'
import expressListRoutes from 'express-list-routes'
import FeatureModel, { IFeature } from '../dataSource/models/featureModel'
import Config from './config'

const env = Config.getEnv()

interface IRouteInfo {
    method: string,
    path: string
}

class RouterIdentity {
    private appRoutes:IRouteInfo[] = []

    public static pathHasMatch(features:IFeature[], reqRoute:IRouteInfo):boolean {
        // loop trough all items in the features
        for (const feature of features) {
            const val = feature.value.split(' - ')
            const method = val[0]
            const path = val[1]

            // if method does not match skip to the next item
            if (method !== reqRoute.method) continue
            // check pattern if it has a match
            const pattern = new UrlPattern(path)
            if (pattern.match(reqRoute.path)) {
                return true
            }
        }
        return false

    }

    public addAppRouteObj(appRoute:any):void { // eslint-disable-line @typescript-eslint/no-explicit-any
        const routes:IRouteInfo[] = expressListRoutes(appRoute, {
            logger: () => {}
        })
        this.appRoutes = [...this.appRoutes, ...routes]
    }

    public getAppRoutes():IRouteInfo[] {
        return this.appRoutes
    }

    public async syncAppRoutes():Promise<void> {
        const query = this.appRoutes.map(item => {
            const val = `${ item.method } - ${ item.path.replace(/\\/g, '/') }`
            const obj:IFeature = {
                name: val,
                type: 'api-route',
                tags: ['Server', 'Api Route', item.method],
                value: val,
                description: 'One of the server endpoint'
            }

            // breakdown path
            const subPaths = item.path
                .replace(env.RootApiEndpoint.replace(/\//g, '\\'), '')
                .split('\\')
                .filter(path => path.indexOf(':') < 0)
                .filter(sub => Boolean(sub))
            
            // console.log(subPaths)

            // assign tags
            obj.tags = subPaths
            
            // assign scope
            const hasAccount = subPaths.indexOf('accounts') > -1
            const hasWorkspace = subPaths.indexOf('workspaces') > -1
            // check for accounts and workspace: assign workspace
            if (hasAccount && hasWorkspace) {
                obj.scope = 'workspace'
            // else if check for accounts: assign account
            } else if (hasAccount) {
                obj.scope = 'account'
            // else: asign app
            } else {
                obj.scope = 'app'
            }

            return {
                updateOne: {
                    filter: { value: obj.value },
                    update: obj,
                    upsert: true
                }
            }
        })
        
        await FeatureModel.bulkWrite(query)
    }
}

export {
    IRouteInfo,
    RouterIdentity
}
export default new RouterIdentity()