const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET_KEY || 'Please_provide_secret_in_dot_env_file'
const jwtExp =    process.env.JWT_EXPIRATION || 24

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
            data, jwtSecret,
            { expiresIn: jwtExp * 3600 }
        )
    },

    verifyJWT(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, jwtSecret, (err, decoded) => {
                if (!err) {
                    resolve(decoded)
                } else {
                    resolve(null)
                }
            })
        })
    }

}