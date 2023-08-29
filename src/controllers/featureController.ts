import DataCache from '../utilities/dataCache'
import FeatureModel, { IFeature, IFeatureQuery, TFeatureType } from '../dataSource/models/featureModel'
import DataRequest, { IListOutput, IPgeInfo } from '../utilities/dataQuery'
// import Config from '../utilities/config'

// const env = Config.getEnv()

class FeatureController {
    public cachedData:DataCache
    public request:DataRequest

    constructor() {
        this.cachedData = new DataCache(FeatureModel, { stdTTL: 30, checkperiod: 15 })
        this.request = new DataRequest(FeatureModel)
    }

    public async getFeature(query:IFeatureQuery):Promise<IFeature|null> {
        if (!query._id) return null
        return await this.cachedData.getItem<IFeature>(query._id)
    }

    public async getAllFeatures():Promise<IFeature[]> {

        const result = await this.cachedData.getAllItems<IFeature>()

        return result
    }

    public async getFeaturesByPage(query:IFeatureQuery = {}, pageInfo: IPgeInfo):Promise<IListOutput<IFeature>> {

        const result = await this.request.getItemsByPage<IFeature>(query, {}, {}, pageInfo)

        return result
    }

    public async saveFeature(type: TFeatureType, value:string, name:string, tags:string, description:string):Promise<IFeature | null> {
        const data:IFeature = {type, value, name, tags: [], description}

        if (tags && tags.length) data.tags = tags.split(',')

        const result = await this.cachedData.createItem<IFeature>(data)

        return result
    }

    public async updateFeature(id:string, type: TFeatureType, value:string, name:string, tags:string, description:string):Promise<IFeature | null> {
        const doc:IFeature = {value, name, description}

        if (type) doc.type = type
        if (tags && tags.length) doc.tags = tags.split(',')

        const result = await this.cachedData.updateItem<IFeature>(id, doc)

        return result
    }

    public async deleteFeature(id:string):Promise<IFeature | null> {

        const result = await this.cachedData.deleteItem<IFeature>(id)

        return result
    }
}

export default new FeatureController()