let crypto = require('crypto');

(() => {
    console.group('Random Key Generator')
    let randKey = crypto.randomBytes(64).toString('hex')
    console.log(`- start generating`)
    console.log('- key (please copy): ', randKey)
    console.log(`- Done`)
    console.groupEnd()
})();