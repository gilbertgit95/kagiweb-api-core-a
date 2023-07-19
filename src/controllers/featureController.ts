import DataCache from '../utilities/dataCache'
import FeatureModel, { IFeature } from '../dataSource/models/featureModel'
import DataRequest, { IListOutput, IPgeInfo } from '../utilities/dataQuery'
import Config from '../utilities/config'

const env = Config.getEnv()

class FeatureController {
    public cachedData:DataCache
    public request:DataRequest

    constructor() {
        this.cachedData = new DataCache(FeatureModel, { stdTTL: 120, checkperiod: 120 })
        this.request = new DataRequest(FeatureModel)
    }

    public async getFeature(query:any):Promise<IFeature|null> {
        return await this.cachedData.getItem(query._id)
    }

    public async getAllFeatures():Promise<IFeature[]> {

        const result = await this.cachedData.getAllItems()

        return result
    }

    public async getFeaturesByPage(query:any = {}, pageInfo: IPgeInfo):Promise<IListOutput> {

        const result = await this.request.getItemsByPage(query, {}, {}, pageInfo)

        return result
    }

    public async saveFeature(doc:IFeature):Promise<IFeature | null> {

        const result = await this.cachedData.createItem(doc)

        return result
    }

    public async updateFeature(id:string, doc:any):Promise<IFeature | null> {

        const result = await this.cachedData.updateItem(id, doc)

        return result
    }

    public async deleteFeature(id:string):Promise<string | null> {

        const result = await this.cachedData.deleteItem(id)

        return result
    }
}

export default new FeatureController()