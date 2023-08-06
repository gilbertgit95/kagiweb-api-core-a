import expressListRoutes from 'express-list-routes'
import FeatureModel, { IFeature } from '../dataSource/models/featureModel'

interface IRouteInfo {
    method: string,
    path: string
}

class RouterIdentity {
    private appRoutes:IRouteInfo[] = []

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
                name: `${ item.method } ${ item.path }`,
                type: 'api-route',
                tags: ['Server', 'Api Route', item.method],
                value: `[${ item.method }]_${ item.path }`,
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
    IRouteInfo
}
export default new RouterIdentity()