const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    btoa(text) {
        return Buffer.from(text).toString('base64')
    },

    atob(text) {
        return Buffer.from(text, 'base64').toString('binary')
    },

    async hashText(text) {
        let salt = await bcrypt.genSalt(10)
        return await bcrypt.hash(text, salt)
    },

    async verifyTextToHash(text, hash) {
        return await bcrypt.compare(text, hash)
    },

    generateJWT(data) {
        return jwt.sign(
            data, process.env.JWT_SECRET_KEY,
            { expiresIn: process.env.JWT_EXPIRATION * 3600 }
        )
    },

    verifyJWT(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
                if (!err) {
                    resolve(decoded)
                } else {
                    resolve(null)
                }
            })
        })
    }

}