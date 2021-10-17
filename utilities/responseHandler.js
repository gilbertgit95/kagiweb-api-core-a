const errorsStatus = require('./statusCodes')

module.exports = {
    jsonRespHandler: (req, res) => {
        return new class {
            constructor() {
                this.req = req
                this.res = res
            }
    
            // the main process
            async execute(callback) {
                // check callback
                try {
                    if (callback && typeof callback == 'function') {
                        let result = await callback({
                            body:    req.body,
                            uparams: req.params,
                            query:   req.query
                        })
                        this.response({
                            code: 200,
                            data: result
                        })
                    }
    
                } catch(err) {
                    //  default error is 500
                    let errorResp = errorsStatus[500]
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
    
                if (resp.code == statusCode) {
                    return this.res.json(resp && resp.data? resp.data: {})
                } else {
                    return this.res
                        .status(statusCode)
                        .json(resp)
                }
            }
        }
    }
}