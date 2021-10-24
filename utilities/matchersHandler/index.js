const pathToRegexp = require('path-to-regexp');

// use to match path to list of endpoints
const hasMatchEndpoints = (reqEndpoint, accessEndpoints) => {
    let endpoints = accessEndpoints.filter(item => {
        return (   item.method == reqEndpoint.method
                && pathToRegexp(item.path).test(reqEndpoint.path))
    })

    return Boolean(endpoints.length)
}

module.exports = {
    hasMatchEndpoints
}