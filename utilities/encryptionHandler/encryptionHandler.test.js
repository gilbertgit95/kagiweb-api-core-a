const {
    btoa,
    atob,
    generateJWT,
    verifyJWT,
    hashText,
    verifyTextToHash
} = require('./');

test('Check btoa and atob', () => {
    let testData = 'wordtest'
    let testData2 = 'wordtest2'

    let encrypted = btoa(testData)
    let decrypted = atob(encrypted)

    expect(decrypted).toBe(testData)
    expect(decrypted).toBeTruthy()
    expect(decrypted).not.toBeNull()
    expect(decrypted).toBeDefined()

    expect(decrypted).not.toBe(testData2)
})

test('Check password hashing and verification', async () => {
    let testData = 'wordtest'
    let testData2 = 'wordtest2'

    let hash = await hashText(testData)
    let test1 = await verifyTextToHash(testData, hash)
    let test2 = await verifyTextToHash(testData2, hash)

    expect(test1).toBe(true)
    expect(test1).toBeTruthy()
    expect(test1).not.toBeNull()
    expect(test1).toBeDefined()

    expect(test2).not.toBe(true)
})

test('Check jwt generator and verifier', async () => {
    let testData = {
        prop: 'testData'
    }

    let jwt = generateJWT(testData)
    let data = await verifyJWT(jwt)

    // delete some additional info not existed in the original data
    delete data.exp
    delete data.iat

    expect(data).toEqual(testData)
    expect(data).toBeTruthy()
    expect(data).not.toBeNull()
    expect(data).toBeDefined()
})

