import Encryption from '../../src/utilities/encryption'

describe('encryption utility testing', () => {
    test('Check btoa and atob', () => {
        let testData = 'wordtest'
        let testData2 = 'wordtest2'
    
        let encrypted = Encryption.btoa(testData)
        let decrypted = Encryption.atob(encrypted)
    
        expect(decrypted).toBe(testData)
        expect(decrypted).toBeTruthy()
        expect(decrypted).not.toBeNull()
        expect(decrypted).toBeDefined()
    
        expect(decrypted).not.toBe(testData2)
    })
    
    test('Check password hashing and verification', async () => {
        let testData = 'wordtest'
        let testData2 = 'wordtest2'
    
        let hash = await Encryption.hashText(testData)
        let test1 = await Encryption.verifyTextToHash(testData, hash)
        let test2 = await Encryption.verifyTextToHash(testData2, hash)
    
        // console.log('password: ', await hashText('master101'))
    
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
    
        let jwt = Encryption.generateJWT(testData)
        let data = await Encryption.verifyJWT(jwt)
    
        // delete some additional info not existed in the original data
        delete data.exp
        delete data.iat
    
        expect(data).toEqual(testData)
        expect(data).toBeTruthy()
        expect(data).not.toBeNull()
        expect(data).toBeDefined()
    })
})
