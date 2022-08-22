const errorsStatus = require('./statusCodes')

const successStatus = 200
const defaultErrorStatus = 500

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
                    console.log('Jsonhandler Error: ', err)
                    this.response(errorResp)
                }
    
                return
            }
    
            // response handlers
            response(resp) {
                if (resp.code == successStatus) {
                    return this.res.json(resp && resp.data? resp.data: {})
                } else {
                    return this.res
                        .status(resp.code)
                        .json({
                            message: resp.message? resp.message: ''
                        })
                }
            }
        }
    }
}