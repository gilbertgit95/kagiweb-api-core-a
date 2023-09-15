import UrlPattern from 'url-pattern'
import expressListRoutes from 'express-list-routes'
import FeatureModel, { IFeature } from '../dataSource/models/featureModel'

interface IRouteInfo {
    method: string,
    path: string
}


class RouterIdentity {
    private appRoutes:IRouteInfo[] = []

    public static pathHasMatch(features:IFeature[], reqRoute:IRouteInfo):boolean {
        // loop trough all items in the features
        for (let feature of features) {
            let val = feature.value.split(' - ')
            let method = val[0]
            let path = val[1]

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
            const obj:IFeature = {
                name: `${ item.method } - ${ item.path }`,
                type: 'api-route',
                tags: ['Server', 'Api Route', item.method],
                value: `${ item.method } - ${ item.path.replace(/\\/g, '/') }`,
                description: 'One of the server endpoint'
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