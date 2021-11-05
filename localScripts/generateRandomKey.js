let crypto = require('crypto');

(() => {
    let randKey = crypto.randomBytes(64).toString('hex')
    console.log(`[Random Key Generator ] start generating`)
    console.log(randKey)
    console.log(`[Random Key Generator ] Done`)
})();