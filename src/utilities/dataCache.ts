import NodeCache from 'node-cache'

import DataRequest, { IListOutput, IPgeInfo } from '../utilities/dataQuery'

const allItemskey = 'all_items'

class DataCache {
    public cache:NodeCache
    public request:DataRequest

    constructor(DataModel:any, cachingOptions:any = {}) {
        this.cache = new NodeCache(cachingOptions)
        this.request = new DataRequest(DataModel)
    }

    /**
     * @async
     * @param data - atleast field _id existed on this parameter
     * @return {Promise<object|null>} the document with the id in the parameters
     */
    public async getItem(id:string):Promise<any|null> {
        let item = null

        // check if the user existed on the cache
        // if it existed, then return from cache
        if (id) {
            if (this.cache.has(id)) {
                const cacheData = this.cache.get(id)
                item = JSON.parse(typeof cacheData === 'string'? cacheData: '')
            } else {
                // else if not, then fetch user from database
                item = await this.request.getItem({_id: id})
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
    public async getAllItems():Promise<any[]> {
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
    public async createItem(doc:any):Promise<any | null> {
        let result = null

        if (doc) {
            result = await this.request.createItem(doc)

            this.cache.set(result._id, JSON.stringify(result))
            if (this.cache.has(allItemskey)) this.cache.del(allItemskey)
        }

        return result
    }

    /**
     * @async
     * @param {string} id - document id tobe updated
     * @param {object} doc - fields tobe updated
     * @returns {Promise<object|null>} the updated document
     */
    public async updateItem(id:string, doc:any):Promise<any | null> {
        let result = null

        if (id) {
            result = await this.request.updateItem({_id: id}, doc)

            this.cache.set(result._id, JSON.stringify(result))
            if (this.cache.has(allItemskey)) this.cache.del(allItemskey)
        }

        return result
    }

    /**
     *
     * @param {string} id - the id of the document
     * @returns {string:null} the id if successfull and null if its not
     */
    public async deleteItem(id:string):Promise<string | null> {
        let result = null

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
}

export default DataCache