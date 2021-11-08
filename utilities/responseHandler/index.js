const errorsStatus = require('./statusCodes')

const successStatus = 200
const defaultErrorStatus = 500

const defaultPageSize = parseInt(process.env.DEFAULT_PAGINATION)
const defaultPageNumber = 1

module.exports = {
    jsonRespHandler: (req, res, next) => {
        return new class {
            constructor() {
                this.req = req
                this.res = res
                this.next = next
            }
    
            // the main process
            async execute(callback) {
                // check callback
                try {
                    if (callback && typeof callback == 'function') {
                        let result = await callback({
                            body:    req.body,
                            params: req.params,
                            query:   req.query
                        })

                        // if thers a next parameter, execure the next function
                        // it means the is used as a middleware
                        if (this.next && typeof this.next == 'function') {
                            this.next()
                        
                        // else, then it is used as a route controller
                        } else {
                            this.response({
                                code: successStatus,
                                data: result
                            })
                        }
                    }
    
                } catch(err) {

                    let errorResp = errorsStatus[defaultErrorStatus]
                    if (err && err.code && errorsStatus[err.code]) {
                        errorResp = {...errorsStatus[err.code], ...err}
                    }
                    this.response(errorResp)
                }
    
                return
            }
    
            // response handlers
            response(resp) {
                let statusCode = resp.code
                delete resp.code
    
                if (resp.code == successStatus) {
                    return this.res.json(resp && resp.data? resp.data: {})
                } else {
                    return this.res
                        .status(statusCode)
                        .json(resp)
                }
            }
        }
    },

    // responsible for handling data into paginated format
    async queryWithPagination({ pageSize, props, path }, callback) {
        let pagesize = (parseInt(props.query.pageSize))? parseInt(props.query.pageSize): defaultPageSize
        let pageNumber = (parseInt(props.query.pageNumber))? parseInt(props.query.pageNumber): defaultPageNumber

        // overwrite page size value if pageSize parameter is supplied
        if (pageSize) pagesize = pageSize
        
        let limit = pagesize
        let offset = (pageNumber - 1) * pagesize

        let resultData = await callback({limit, offset})

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
}