import clipboard from 'clipboardy'
import prompts from 'prompts'
import Encryption from '../utilities/encryption'

class GenerateKey {
    public label = 'KeyGenerator'
    public value = 'keyGen'
    public desc = 'This will generate random keys'

    public async execute():Promise<void> {
        console.log('select options to execute')
    }

    /**
     * This will generate random key and also write the value to the clipboard
     * @returns { Promise } a random key
     */
    public async randomKey():Promise<string> {
        console.log('[Generate Random Key]')
        const key = Encryption.generateRandKey()
        await clipboard.write(key)
        console.log(` - Key has been written to clipboard: ${ key }`)
        console.log(` - You can just paste it anyware you want.`)

        return key
    }

}

export default new GenerateKey()