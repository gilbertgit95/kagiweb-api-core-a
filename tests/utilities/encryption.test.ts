import Encryption from '../../src/utilities/encryption'

describe('encryption utility testing', () => {
    test('Check btoa and atob', () => {
        const testData = 'wordtest'
        const testData2 = 'wordtest2'
    
        const encrypted = Encryption.btoa(testData)
        const decrypted = Encryption.atob(encrypted)
    
        expect(decrypted).toBe(testData)
        expect(decrypted).toBeTruthy()
        expect(decrypted).not.toBeNull()
        expect(decrypted).toBeDefined()
    
        expect(decrypted).not.toBe(testData2)
    })
    
    test('Check password hashing and verification', async () => {
        const testData = 'wordtest'
        const testData2 = 'wordtest2'
    
        const hash = await Encryption.hashText(testData)
        const test1 = await Encryption.verifyTextToHash(testData, hash)
        const test2 = await Encryption.verifyTextToHash(testData2, hash)
    
        // console.log('password: ', await hashText('master101'))
    
        expect(test1).toBe(true)
        expect(test1).toBeTruthy()
        expect(test1).not.toBeNull()
        expect(test1).toBeDefined()
    
        expect(test2).not.toBe(true)
    })
    
    test('Check jwt generator and verifier', async () => {
        interface ITestData {
            prop: string
        }
        const testData = {
            prop: 'testData'
        }
    
        const jwt = Encryption.generateJWT(testData)
        const data = await Encryption.verifyJWT<ITestData>(jwt)
    
        // console.log('test verify: ', data)
        // expect(data).toEqual(testData)
        expect(data).toBeTruthy()
        expect(data).not.toBeNull()
        expect(data).toBeDefined()
    })
})
