const pathToRegexp = require('path-to-regexp');
/**
 * Contains matching functions
 * @module matchersHandler
 */

/**
 * ->. Match an endpoint to list of endpoints, then returns
 * true if it has atleast 1 match
 * @param { Object } reqEndpoint - request endpoint to compare
 * @param { Array<Object> } accessEndpoints - list endpoints for comparison
 * @returns { Boolean } true if it has a match
 */
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