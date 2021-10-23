module.exports = async (req, res, next) => {
    req.account = {}
    console.log('check access then bind account info in the request object')
    return next()
}