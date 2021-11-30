const { Sequelize } = require('../../dataSource/models');

/**
 * This module is responsible for the most common db queries
 * like, fetch single item, update, create, fetch with paggination
 * and more.
 * 
 * @module utilities/queryHandler
 */

/**
 * @global
 * @typedef PagginatedItems
 * @property { string | null } next - the next url if there still a next page, null it it does not have
 * @property { number } pageSize - the number of items per page
 * @property { number } pageNumber - the current page number
 * @property { number } totalPage - the total number of pages
 * @property { number } totalItems - the total number of items
 * @property { Array<Object> } items - the items of the current page
 */

const OPERATORS = Sequelize.Op;

const defaultPageSize = parseInt(process.env.DEFAULT_PAGINATION) || 100;
const defaultPageNumber = 1;

module.exports = {
    /**
     * ->. fetches a single item using a uuid
     * @async
     * @param { Object | Function } modelQuery - a custom query function or a sequelize model
     * @param { string } uuid - uuid of the item
     * @returns { Promise<Object> } the item being fetched
     * @throws { ErrorMessage } if an error occurs throw error message with code 500 or 404
     */
    async getItem(modelQuery, uuid) {
        let item = {}

        try {
            // if a query function exist use this instead
            if (modelQuery && typeof modelQuery == 'function') {
                item = await modelQuery()

            // the default query is through the model
            } else {
                item = await modelQuery.findOne({ where: { uuid }})
            }

            if (!item) throw({})

        } catch (err) {
            if (err.errors) {
                throw({code: 500, message: err.errors[0].message})
            } else {
                throw({code: 404, message: 'None existing data.'})
            }
        }

        return item
    },

    /**
     * ->. create a single item
     * @async
     * @param { Object } modelQuery - a sequelize model
     * @param { Object } item - item tobe created
     * @returns { Promise<Object> } the item that is created
     * @throws { ErrorMessage } if an error occurs throw error message
     */
    async createItem(model, item) {
        let createdData = {}

        try {
            createdData = await model.create(item)
        } catch (err) {
            if (err.errors) {
                throw({code: 500, message: err.errors[0].message})
            } else {
                throw(err)
            }
        }

        return createdData
    },

    /**
     * ->. Updates a single item
     * @async
     * @param { Object } model - a sequelize model
     * @param { Object } item - item tobe updated
     * @param { Function } setter - a function that is responsible for setting the values
     * @returns { Promise<Object> } the updated item
     * @throws { ErrorMessage } if an error occurs throw error message 500 or 404
     */
    async updateItem(model, item, setter) {
        let tobeUpdated = {}

        try {
            tobeUpdated = await model.findOne({ where: { uuid: item.uuid }})

            if (!tobeUpdated) throw({})

            tobeUpdated = setter(tobeUpdated, item)

            await tobeUpdated.save()

        } catch (err) {
            if (err.errors) {
                throw({code: 500, message: err.errors[0].message})
            } else {
                throw({code: 404, message: 'None existing data.'})
            }
        }

        return tobeUpdated
    },

    /**
     * ->. Delete an item using its uuid
     * @async
     * @param { Object } model - sequelize model
     * @param { string } uuid - uuid of the item tobe deleted
     * @returns { Promise<Object> } the deleted item
     * @throws { ErrorMessage } if an error occurs throw error message 500 or 404
     */
    async deleteItem(model, uuid) {
        let tobeDeleted = {}

        try {
            tobeDeleted = await model.findOne({ where: { uuid }})

            if (!tobeDeleted) throw({})

            await tobeDeleted.destroy()

        } catch (err) {
            if (err.errors) {
                throw({code: 500, message: err.errors[0].message})
            } else {
                throw({code: 404, message: 'None existing data.'})
            }
        }

        return tobeDeleted
    },

    /**
     * ->. Fetches list in pagginated or in plain list format
     * @async
     * @param { Object | Function } propsQuery - if object then expect to return pagginated data if function then expect to return a plain arary of items
     * @param { Function } query - the query function
     * @returns { Promise<PagginatedItems | Array<Object>> } paginated return or just a plain array of items
     * @throws { ErrorMessage } if an error occurs throw error message
     */
    async getItems(propsQuery, query) {
        try {
            // if a propsQuery is a function then use this function to query
            if (propsQuery && typeof propsQuery == 'function') {
                return await propsQuery()

            // the default process is query with pagination
            } else {
                let { pageSize, props, path } = propsQuery
                let pagesize = (parseInt(props.query.pageSize))? parseInt(props.query.pageSize): defaultPageSize
                let pageNumber = (parseInt(props.query.pageNumber))? parseInt(props.query.pageNumber): defaultPageNumber

                // overwrite page size value if pageSize parameter is supplied
                if (pageSize) pagesize = pageSize
                
                let limit = pagesize
                let offset = (pageNumber - 1) * pagesize

                let resultData = await query({limit, offset})

                let items = resultData.rows
                let totalItems = resultData.count
                let totalPage = Math.ceil(totalItems / pagesize)
                let hasNext = pageNumber < totalPage

                // generate next path
                let nextPage = `${ path }?`
                nextPage += [
                    // append the page number and pagesize
                    ...[
                        `pageNumber=${ pageNumber + 1 }`,
                        `pageSize=${ pagesize }`
                    ],
                    // append the other query params
                    ...Object.keys(props.query)
                        .filter(i => !(new Set(['pageNumber', 'pageSize'])).has(i))
                        .map(i => `${ i }=${ props.query[i] }`)
                ].join('&')

                return {
                    next: hasNext? nextPage: null,
                    pageSize: pagesize,
                    pageNumber,
                    totalPage,
                    totalItems,
                    items
                }
            }

        } catch (err) {
            console.log(err)
            throw({code: 500, message: 'Error while fetching the data.'})
        }
    },

    /**
     * ->. Bulk create items
     * @async
     * @param { Object } model - Sequelize model
     * @param { Array<Object> } items - the array of items tobe created
     * @returns { Promise<Array<Object>> } return the created items
     * @throws { ErrorMessage } if an error occurs throw error message
     */
    async bulkCreate(model, items) {
        let createdData = null

        if (!(items && items.length)) {
            throw({code: 500, message: 'No items to create.'})
        }

        try {
            createdData = await model.bulkCreate(
                items, { validate: true }
            )
        } catch (err) {
            if (err.errors) {
                throw({code: 500, message: err.errors[0].message})
            } else {
                throw(err)
            }
        }

        return createdData
    },

    /**
     * ->. Bulk update items
     * @async
     * @param { Object } model - Sequelize model
     * @param { Array<Object> } items - the array of items tobe updated
     * @param { Function } setter - callback function the lets you update values
     * @returns { Promise<Array<Object>> } return the updated items
     * @throws { ErrorMessage } if an error occurs throw error message
     */
    async bulkUpdate(model, items, setter) {
        let result = []

        try {
            // fetching items
            let queryOptions = {
                where: { uuid: { [OPERATORS.in]: items.map(item => item.uuid) }}
            }
            let existingItems = await model.findAll(queryOptions)
            
            // generate map using existing items in the database
            let existingItemsMap = existingItems.reduce((acc, item) => {
                acc[item.uuid] = item
                return acc
            }, {})
            // generate paired model and update items
            let pairedModelToUpdate = items.map(item => {
                return {
                    modelData: existingItemsMap[item.uuid],
                    updateData: item
                }
            })

            // loop for the actual update
            for (let item of pairedModelToUpdate) {
                try {
                    if (item.modelData) {
                        // set the data to update then save
                        let updateModel = setter(item.modelData, item.updateData)
                        let updatedData = await updateModel.save()
                        result.push(updatedData)
                    } else {
                        throw('None Existing data')
                    }
                } catch (err) {
                    let error = err.errors? err.errors[0].message: err
                    result.push({...{uuid: item.updateData.uuid}, ...{error}})
                }
            }
        } catch (err) {
            if (err.errors) {
                throw({code: 500, message: err.errors[0].message})
            } else {
                throw(err)
            }
        }

        return result
    },

    /**
     * ->. Bulk delete items
     * @async
     * @param { Object } model - Sequelize model
     * @param { Array<Object> } items - the array of items tobe deleted
     * @returns { Promise<Array<Object>> } return the deleted items
     * @throws { ErrorMessage } if an error occurs throw error message
     */
    async bulkDelete(model, items) {
        let deleted = null

        if (!(items && items.length)) {
            throw({code: 500, message: 'No items to delete.'})
        }

        try {
            let queryOptions = {
                where: { uuid: { [OPERATORS.in]: items.map(item => item.uuid) }}
            }

            // fetch data tobe deleted
            deleted = await model.findAll(queryOptions)

            // bulk delete all the data tobe deleted
            await model.destroy(queryOptions)

        } catch (err) {
            if (err.errors) {
                throw({code: 500, message: err.errors[0].message})
            } else {
                throw(err)
            }
        }

        return deleted
    }
}