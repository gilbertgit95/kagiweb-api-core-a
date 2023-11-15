import NodeCache, {Options} from 'node-cache'
import { Model } from '../packages/mongoose'

import DataRequest from '../utilities/dataQuery'

const allItemskey = 'all_items'

class DataCache {
    public cache:NodeCache
    public request:DataRequest

    constructor(DataModel: Model<any>, cachingOptions:Options) { // eslint-disable-line @typescript-eslint/no-explicit-any
        this.cache = new NodeCache(cachingOptions)
        this.request = new DataRequest(DataModel)
    }

    /**
     * @async
     * @param data - atleast field _id existed on this parameter
     * @return {Promise<object|null>} the document with the id in the parameters
     */
    public async getItem<Type extends {_id?:string}>(id:string):Promise<Type|null> {
        let item:Type|null = null

        // check if the user existed on the cache
        // if it existed, then return from cache
        if (id) {
            if (this.cache.has(id)) {
                const cacheData = this.cache.get(id)
                item = JSON.parse(typeof cacheData === 'string'? cacheData: '')
            } else {
                // else if not, then fetch user from database
                item = await this.request.getItem<Type>({_id: id})
                // then save the item to cache, then return item
                if (item && item._id) this.cache.set(item._id, JSON.stringify(item))
            }
        }

        return item
    }

    /**
     * this method should only be use to fetch small data set
     * or limit number of data, for example: countries, roles, features and more
     * @returns {Array<object>} list of all documents fetched
     */
    public async getAllItems<Type>():Promise<Type[]> {
        let result = []

        if (this.cache.has(allItemskey)) {
            const cacheData = this.cache.get(allItemskey)
            result = JSON.parse(typeof cacheData === 'string'? cacheData: '')
        } else {
            const resp = await this.request.getItems()

            if (resp.items) {
                result = resp.items
                this.cache.set(allItemskey, JSON.stringify(result))
            }
        }

        return result
    }

    /**
     * @async
     * @param {object} doc - is a document object tobe created
     * @returns {Promise<object | null>} the object created or null if it was not able to create the document
     */
    public async createItem<Type extends {_id?:string}>(doc:any):Promise<Type | null> { // eslint-disable-line @typescript-eslint/no-explicit-any
        let result = null

        if (doc) {
            result = await this.request.createItem(doc)

            if (result && result._id) {
                this.cache.set(result._id, JSON.stringify(result))
                if (this.cache.has(allItemskey)) this.cache.del(allItemskey)
            }
        }

        return result
    }

    /**
     * @async
     * @param {string} id - document id tobe updated
     * @param {object} doc - fields tobe updated
     * @returns {Promise<object|null>} the updated document
     */
    public async updateItem<Type extends {_id?:string}>(id:string, doc:any):Promise<Type | null> { // eslint-disable-line @typescript-eslint/no-explicit-any
        let result = null

        if (id) {
            result = await this.request.updateItem<Type>({_id: id}, doc)

            if (result && result._id) {
                this.cache.set(result._id, JSON.stringify(result))
                if (this.cache.has(allItemskey)) this.cache.del(allItemskey)
            }
        }

        return result
    }

    /**
     *
     * @param {string} id - the id of the document
     * @returns {string:null} the id if successfull and null if its not
     */
    public async deleteItem<Type>(id:string):Promise<Type | null> {
        let result:Type|null = null

        if (id) {
            result = await this.request.deleteItem({_id: id})
            // console.log('delete: ', result)
            if (this.cache.has(id)) {
                this.cache.del(id)
                if (this.cache.has(allItemskey)) this.cache.del(allItemskey)
            }
        }

        return result
    }

    /**
     * 
     * @param id - id of the data to remove from cache
     */
    public removeCacheData(id:string):void {
        if (this.cache.has(id)) {
            this.cache.del(id)
            if (this.cache.has(allItemskey)) this.cache.del(allItemskey)
        }
    }
}

export default DataCache