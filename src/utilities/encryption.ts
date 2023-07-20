import bcrypt from 'bcrypt'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'

import Config from './config'

const env = Config.getEnv()

class Encryption {
    /**
     * this will generate random key
     * @returns { string } random series of string
     */
    public static generateRandKey():string {
        return crypto.randomBytes(64).toString('hex')
    }

    /**
     * this will generate a 6 digit random number
     * @returns { Number } 6 digit key number
     */
    public static generateRandNumber():number {
        return Math.floor(1e5 + Math.random () * 9e5)
    }

    /**
     * Converts string of text to base64 string
     * @param { string } text - any text
     * @returns { string } Base64 string
     */
    public static  btoa(text: string):string {
        return Buffer.from(text).toString('base64')
    }

    /**
     * Converts base64 string into the original text
     * @param { string } text - base46 string
     * @returns { string } original text
     */
    public static  atob(text: string):string {
        return Buffer.from(text, 'base64').toString('binary')
    }

    /**
     * Encrypt password texts
     * @async
     * @param { string } text - password text
     * @returns { Promise<string> } encypted
     */
    public static async hashText(text: string):Promise<string> {
        const salt = await bcrypt.genSalt(10)
        return await bcrypt.hash(text, salt)
    }

    /**
     * Check if a password maches to a hash or encrypted password
     * @async
     * @param { string } text - password text
     * @param { string } hash - exncrypted text
     * @returns { Promise<boolean> } true if it match
     */
    public static async verifyTextToHash(text: string, hash: string):Promise<boolean> {
        return await bcrypt.compare(text, hash)
    }

    /**
     * This will generate jwt token
     * @param { Object } data - object that will be encrypted into jwt
     * @returns { string } a JWT token
     */
    public static  generateJWT(data: any):string {
        return jwt.sign(
            data, env.JwtSecretKey,
            { expiresIn: env.JwtExp * 3600 }
        )
    }

    /**
     * This will return the original object from the jwt token
     * @async
     * @param { string } token - jwt token
     * @returns { Promise<Object> } the encrypted object
     */
    public static async verifyJWT(token: string):Promise<any> {
        return new Promise((resolve) => {
            jwt.verify(token, env.JwtSecretKey, (err, decoded) => {
                if (!err) {
                    resolve(decoded)
                } else {
                    resolve(null)
                }
            })
        })
    }
}

export default Encryption