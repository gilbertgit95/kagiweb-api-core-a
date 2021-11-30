const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * This module is responsible for handling encryptions, like
 * passwords, jwt and some base64 convertions.
 * 
 * @module encryptionHandler
 * @memberof utilities
 */

const jwtSecret = process.env.JWT_SECRET_KEY || 'Please_provide_secret_in_dot_env_file'
const jwtExp =    process.env.JWT_EXPIRATION || 24

module.exports = {
    /**
     * ->. Converts string of text to base64 string
     * @param { string } text - any text
     * @returns { string } Base64 string
     */
    btoa(text) {
        return Buffer.from(text).toString('base64')
    },

    /**
     * ->. Converts base64 string into the original text
     * @param { string } text - base46 string
     * @returns { string } original text
     */
    atob(text) {
        return Buffer.from(text, 'base64').toString('binary')
    },

    /**
     * ->. Encrypt password texts
     * @async
     * @param { string } text - password text
     * @returns { Promise<string> } encypted
     */
    async hashText(text) {
        let salt = await bcrypt.genSalt(10)
        return await bcrypt.hash(text, salt)
    },

    /**
     * ->. Check if a password maches to a hash or encrypted password
     * @async
     * @param { string } text - password text
     * @param { string } hash - exncrypted text
     * @returns { Promise<boolean> } true if it match
     */
    async verifyTextToHash(text, hash) {
        return await bcrypt.compare(text, hash)
    },

    /**
     * ->. This will generate jwt token
     * @param { obj } data - object that will be encrypted into jwt
     * @returns { string } a JWT token
     */
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