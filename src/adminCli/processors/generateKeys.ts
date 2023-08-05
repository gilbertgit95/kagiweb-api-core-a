import clipboard from 'clipboardy'
import prompts from 'prompts'
// import prompts from 'prompts'
import Encryption from '../../utilities/encryption'

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
    public async randomKey():Promise<void> {
        console.log('[Generate Random Key]')
        const key = Encryption.generateRandKey()
        await clipboard.write(key)
        console.log(` - Key has been written to clipboard: ${ key }`)
        console.log(` - You can just paste it anyware you want.`)
    }

    public async hashPassword():Promise<void> {
        // get text input
        const input = await prompts({
            type: 'text',
            name: 'value',
            message: 'Enter you password'
        })
        // then hash the text
        const hash = await Encryption.hashText(input.value)

        // then write hash to console and clipboard
        await clipboard.write(hash)
        console.log(` - Hashed text has been written to clipboard: ${ hash }`)
        console.log(` - You can just paste it anyware you want.`)
    }

}

export default new GenerateKey()