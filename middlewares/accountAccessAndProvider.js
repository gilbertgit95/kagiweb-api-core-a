module.exports = async (req, res, next) => {
    req.account = {}
    return next()
}