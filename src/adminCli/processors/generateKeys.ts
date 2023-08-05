import prompts from 'prompts'

import Encryption from '../../utilities/encryption'

class GenerateKey {
    public label = 'KeyGenerator'
    public value = 'keyGen'
    public desc = 'This will generate random keys'

    public async execute():Promise<void> {
        const initPrompt = await prompts({
            type: 'select',
            name: 'action',
            message: 'Select sub process you want to execute',
            choices: [
                {
                    title: 'Generate random Key',
                    value: 'genRandKey',
                    description: 'This will generate a random key'
                },
                {
                    title: 'Encrypt password',
                    value: 'hashPass',
                    description: 'This will generate hash out of a readable password'
                }
            ]
        })

        // select action to execute
        switch(initPrompt.action) {
            case 'genRandKey':
                this.randomKey()
                break
            case 'hashPass':
                this.hashPassword()
                break
            default:
                console.log('No option has been selected')
        }
    }

    /**
     * This will generate random key and also write the value to the clipboard
     * @returns { Promise } a random key
     */
    public async randomKey():Promise<void> {
        console.log('[Generate Random Key]')
        const key = Encryption.generateRandKey()
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

        console.log(` - Hashed text is : ${ hash }`)
    }

}

export default new GenerateKey()