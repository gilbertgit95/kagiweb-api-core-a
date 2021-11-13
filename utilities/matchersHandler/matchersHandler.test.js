const { TestWatcher } = require('@jest/core');
const {
    hasMatchEndpoints
} = require('./');

test('Check path matcher', () => {
    let accessEndpoints = [
        {
            method: 'GET',
            path: '/api/v1/tests/:vals'
        },
        {
            method: 'GET',
            path: '/api/v1/tests?testQuery=test'
        },
        {
            method: 'GET',
            path: '/api/v1/tests/:vals?testQuery=test'
        }
    ]

    // equal path
    let reqEndpoint = {
        method: 'GET',
        path: '/api/v1/tests/testing'
    }
    let reqEndpoint2 = {
        method: 'GET',
        path: '/api/v1/tests/testing?testQuery=test'
    }
    let reqEndpoint3 = {
        method: 'GET',
        path: '/api/v1/tests/:vals?testQuery=test'
    }

    // not equal path
    let reqEndpoint4 = {
        method: 'POST',
        path: '/api/v1/tests/:vals?testQuery=test'
    }
    let reqEndpoint5 = {
        method: 'GET',
        path: '/api/v1/teststest/:vals?testQuery=test'
    }

    expect(hasMatchEndpoints(reqEndpoint, accessEndpoints)).toBe(true)
    expect(hasMatchEndpoints(reqEndpoint2, accessEndpoints)).toBe(true)
    expect(hasMatchEndpoints(reqEndpoint3, accessEndpoints)).toBe(true)

    expect(hasMatchEndpoints(reqEndpoint4, accessEndpoints)).not.toBe(true)
    expect(hasMatchEndpoints(reqEndpoint5, accessEndpoints)).not.toBe(true)
})