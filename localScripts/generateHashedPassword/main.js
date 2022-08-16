require('dotenv').config();
const encryptionHandler = require('../../utilities/encryptionHandler');

const getParam = (prop) => {
    let argv = process.argv

    let propVal = argv.filter(item => {
        return item.indexOf(prop + ':') === 0
    })

    if (!(propVal && propVal.length)) {
        return null
    }

    return propVal[0].replace(prop + ':', '')
}

(async () => {
    console.group('Generate Hashed password')
    let password = getParam('value')

    if (!password) {
        console.log('No password supplied. Please enter -> npm run <command> value:<pasword>')
        return
    }

    let hashedPass = await encryptionHandler.hashText(password)
    console.log(password + ' -> ', hashedPass)
    console.groupEnd()
})();