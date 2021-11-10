const { Sequelize } = require('../../dataSource/models');

const OPERATORS = Sequelize.Op;

const defaultPageSize = parseInt(process.env.DEFAULT_PAGINATION) || 100;
const defaultPageNumber = 1;

module.exports = {
    // responsible for getting a single item
    async getItem(model, uuid) {
        let endPoint = {}

        try {
            endPoint = await model.findOne({ where: { uuid }})

            if (!endPoint) throw({code: 500, message: 'None existing data.'})

        } catch (err) {
            if (err.errors) {
                throw({code: 500, message: err.errors[0].message})
            } else {
                throw(err)
            }
        }

        return endPoint
    },

    // responsible for single creation
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

    // responsible for single creation
    async updateItem(model, item, setter) {
        let tobeUpdated = {}

        try {
            tobeUpdated = await model.findOne({ where: { uuid: item.uuid }})

            if (!tobeUpdated) throw({code: 500, message: 'None existing data.'})

            tobeUpdated = setter(tobeUpdated, item)

            await tobeUpdated.save()

        } catch (err) {
            if (err.errors) {
                throw({code: 500, message: err.errors[0].message})
            } else {
                throw(err)
            }
        }

        return tobeUpdated
    },

    // responsible for single creation
    async deleteItem(model, uuid) {
        let tobeDeleted = {}

        try {
            tobeDeleted = await model.findOne({ where: { uuid }})

            if (!tobeDeleted) throw({code: 500, message: 'None existing data.'})

            await tobeDeleted.destroy()

        } catch (err) {
            if (err.errors) {
                throw({code: 500, message: err.errors[0].message})
            } else {
                throw(err)
            }
        }

        return tobeDeleted
    },

    // responsible for handling data into paginated format
    async getItems({ pageSize, props, path }, query) {
        try {

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

        } catch (err) {
            throw({code: 500, message: 'Error while fetching the data.'})
        }
    },

    // responsible for handling bulk create
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

    // responsible for the bulk update
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
                    result.push({...item.updateData, ...{error}})
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

    // resonsible for handling bulk delete
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