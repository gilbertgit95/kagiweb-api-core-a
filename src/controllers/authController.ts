import moment from 'moment'
import UserModel, { IUser, IClientDevice, IAccessToken, IContactInfo } from '../dataSource/models/userModel'
import userController from './userController'
import roleController from './roleController'
import Encryption from '../utilities/encryption'
import Config from '../utilities/config'
import { IRole } from '../dataSource/models/roleModel'

const env = Config.getEnv()

interface ISigninResult {
    userInfo: IUser,
    jwt: string
}

class AuthController {
    /**
     * 
     * @param {Object} user - is user object
     * @param {string} password - plain text password
     * @returns {boolean}
     */
    public async verifyPassword(user:IUser, password:string):Promise<boolean> {
        const currPasswords = user!.passwords
            .filter(pass => pass.isActive)
        const currPassword = (
               currPasswords
            && currPasswords.length
            && currPasswords[0].key
        )? currPasswords[0]: undefined

        // match password
        let passwordMatch = false
        if (currPassword) {
            passwordMatch = await Encryption
                .verifyTextToHash(password, currPassword.key)
        }

        return passwordMatch
    }

    public async verifyPasswordNotYetUsed(user:IUser, password:string):Promise<boolean> {
        let result  = true

        for (const pass of user.passwords) {
            if (await Encryption.verifyTextToHash(password, pass.key)) {
                result = false
                break
            }
        }

        return result
    }

    public verifyLTKey(user:IUser, lt:string, key:string):boolean {
        let result = false

        const ltData = userController.getLT(user, lt)

        if (ltData && !ltData.disabled && ltData.key === key) result = true

        return result
    }

    public async signin(username:string, password:string, device:IClientDevice, ip:string):Promise<{token?: string, username?: string} | null> {

        // fetch user using the username
        let user = await UserModel.findOne({ username, verified: true })
        let result:{token?: string, username?: string} | null


        // if no user found
        if (!user) {
            throw(404) // resource not found
        }
        if (user && user.disabled) {
            throw(423) // is locked
        }


        // if user exist then encrement the signin attempt
        let signinLT = userController.getLT(user, 'signin')
        // encrement attempt
        if (signinLT) {
            user.limitedTransactions.id(signinLT._id)!.attempts++
            await user.save()
            userController.cachedData.removeCacheData(user!._id) // remove cache
        }
        // check if signin is enable and also check for the attmpts compared to the limit
        if (!userController.isLTValid(user, 'signin')) {
            user.disabled = true
            await user.save()
            userController.cachedData.removeCacheData(user!._id) // remove cache
            throw(423) // is locked
        }


        // if a match, set user authentication related data
        // credential match
        if (await this.verifyPassword(user, password)) {
            // check LT of otp-signin
            const otpSigninLT = userController.getLT(user, 'otp-signin')
            if (otpSigninLT && !otpSigninLT.disabled) {
                // create randnom key and expiration time
                const otpKey:string = Encryption.generateRandNumber().toString()
                const expTime:string = moment()
                    .add(env.DafaultUserLTExpiration, 'minutes')
                    .toDate().toISOString()

                // reset otp-signin with the random key
                user.limitedTransactions.id(otpSigninLT._id)!.attempts = 0
                user.limitedTransactions.id(otpSigninLT._id)!.key = otpKey
                user.limitedTransactions.id(otpSigninLT._id)!.expTime = expTime

                await user.save()
                // send otp to the LT recepient
                // ---------------->>>>> code here for sending opt key
                console.log(`System is sending signin otp to ${ signinLT!.recipient } with key ${ otpKey }`)
                // then return userId
                return { username: user.username }
            }

            // normal signin
            const jwtStr = await Encryption.generateJWT({userId: user!._id})
            const accessToken:IAccessToken = {
                jwt: jwtStr,
                ipAddress: ip,
                disabled: false
            }

            // assign access token to device
            // get device 
            let deviceId = userController.getDevice(user!, device)?._id
            // if device exist, push the new token to the existing device
            if (!deviceId) {
                user!.clientDevices.push(device)
                user = await user!.save()
                deviceId = userController.getDevice(user, device)?._id
            }
            user!.clientDevices.id(deviceId)?.accessTokens?.push(accessToken)
            result = {token: jwtStr}

            // reset signinLT
            if (signinLT) {
                user.limitedTransactions.id(signinLT._id)!.attempts = 0
            }

            await user!.save()
            userController.cachedData.removeCacheData(user!._id) // remove cache

        // Throw error when user does not exist or password not match
        } else {
            throw(404) // Resource not found
        }

        return result
    }

    // userId:string, code:string
    public async signinOTP(username:string, key:string, device:IClientDevice, ip:string):Promise<{token: string} | null> {
        // fetch user using the username
        let user = await UserModel.findOne({ username, verified: true })
        let result:{ token: string } | null


        // if no user found
        if (!user) {
            throw(403) // Forbidden access to resources.
        }
        if (user && user.disabled) {
            throw(423) // is locked
        }


        // if user exist then encrement the signin attempt
        const signinLT = userController.getLT(user, 'signin')
        const otpSigninLT = userController.getLT(user, 'otp-signin')
        // encrement attempt
        if (otpSigninLT) {
            user!.limitedTransactions.id(otpSigninLT._id)!.attempts++
            await user.save()
            userController.cachedData.removeCacheData(user!._id) // remove cache
        }
        // check if signin is enable and also check for the attmpts compared to the limit
        if (!userController.isLTValid(user, 'otp-signin')) {
            throw(403) // Forbidden access to resources.
        }

        if (this.verifyLTKey(user, 'otp-signin', key)) {
            // then if the device is not yet registered, then register the device
            // then generate jwt for the device with ip address info
            // then return user info and the generated jwt
            // normal signin
            const jwtStr = await Encryption.generateJWT({userId: user!._id})
            const accessToken:IAccessToken = {
                jwt: jwtStr,
                ipAddress: ip,
                disabled: false
            }

            // assign access token to device
            // get device 
            let deviceId = userController.getDevice(user!, device)?._id
            // if device exist, push the new token to the existing device
            if (!deviceId) {
                user!.clientDevices.push(device)
                user = await user!.save()
                deviceId = userController.getDevice(user, device)?._id
            }
            user!.clientDevices.id(deviceId)?.accessTokens?.push(accessToken)
            result = {token: jwtStr}

            // reset signinLT
            if (signinLT) {
                user.limitedTransactions.id(signinLT._id)!.attempts = 0
            }
            if (otpSigninLT) {
                user.limitedTransactions.id(otpSigninLT._id)!.attempts = 0
                user.limitedTransactions.id(otpSigninLT._id)!.key = ''
                user.limitedTransactions.id(otpSigninLT._id)!.expTime = ''
            }

            await user!.save()
            userController.cachedData.removeCacheData(user!._id) // remove cache
        } else {
            throw(403) // Forbidden access to resources.
        }

        return result
    }

    public async signup(username:string, password:string, email?:string, phone?:string):Promise<{message:string}> {
        let contactinfos:IContactInfo[] = []
        // check username and password exist
        if (!(username && password)) throw(400) // Incorrect content in the request
        // check username is unique
        if (await UserModel.findOne({username})) throw(409) // conflict

        // validate data here ---->>>

        // if email exist check if email is unique then generate email contact info
        if (email) {
            if (await UserModel.findOne({'contactInfos.value': email})) {
                throw(409) // conflict
            } else {
                contactinfos.push({
                    type: 'email-address',
                    value: email
                })
            }
        }
        // if phone exist check if phone is unique then generate phone contact info
        if (phone) {
            if (await UserModel.findOne({'contactInfos.value': phone})) {
                throw(409) // conflict
            } else {
                contactinfos.push({
                    type: 'mobile-number',
                    value: phone
                })
            }
        }

        // get the least role available
        const role = await roleController.getLeastRole()

        // create new user entry data with default data
        // set the contact informations
        // set the password
        const user = {
            username,
            rolesRefs: role? [{roleId: role._id, isActive: true}]: [],
            userInfo: [],
            passwords: [
                { key: await Encryption.hashText(password), isActive: true }
            ],
            contactInfos: contactinfos,
            clientDevices: [],
            limitedTransactions: [
                { limit: 5, type: 'signin' },
                { limit: 5, type: 'otp-signin', disabled: true },
                { limit: 5, type: 'forgot-pass' },
                { limit: 5, type: 'reset-pass' },
                { limit: 5, type: 'verify-contact'}
            ],
            disabled: true,
            verified: false
        }

        // then save the new user to the database
        await UserModel.create(user)

        // send notification to recepient here ------>>>>

        return { message: 'User successfully created' }
    }

    public async forgotPassword(username:string):Promise<{ username:string } | null> {
        // fetch user using the username
        let user = await UserModel.findOne({ username, verified: true })
        let result:{ username: string } | null = null


        // if no user found
        if (!user) {
            throw(404) // resource not found
        }
        if (user && user.disabled) {
            throw(423) // is locked
        }


        // if user exist then encrement the forgot-pass attempt
        const resetPassLT = userController.getLT(user, 'reset-pass')
        const forgotPassLT = userController.getLT(user, 'forgot-pass')
        // encrement attempt
        if (forgotPassLT) {
            user!.limitedTransactions.id(forgotPassLT._id)!.attempts++
            await user.save()
            userController.cachedData.removeCacheData(user!._id) // remove cache
        }
        // check if forgot-pass is enable and also check for the attmpts compared to the limit
        if (!userController.isLTValid(user, 'forgot-pass')) {
            user.disabled = true
            await user.save()
            userController.cachedData.removeCacheData(user!._id) // remove cache
            throw(423) // is locked
        }

        if (resetPassLT && !resetPassLT.disabled) {
            const otpKey:string = Encryption.generateRandNumber().toString()
            const expTime:string = moment()
                .add(env.DafaultUserLTExpiration, 'minutes')
                .toDate().toISOString()

            // reset otp-signin with the random key
            user.limitedTransactions.id(resetPassLT._id)!.attempts = 0
            user.limitedTransactions.id(resetPassLT._id)!.key = otpKey
            user.limitedTransactions.id(resetPassLT._id)!.expTime = expTime
            await user.save()
            // send otp to the LT recepient
            // ---------------->>>>> code here for sending opt key
            console.log(`System is sending password reset otp to ${ forgotPassLT!.recipient } with key ${ otpKey }`)
            // then return userId
            result = { username: user.username }
        } else {
            throw(404) // resource not found
        }

        return result
    }

    public async resetPassword(username:string, key:string, newPassword:string):Promise<{ message: string } | null> {
        // fetch user using the username
        let user = await UserModel.findOne({ username, verified: true })
        let result:{ message: string } | null = null


        // if no user found
        if (!user) {
            throw(403) // Forbidden access to resources.
        }
        if (user && user.disabled) {
            throw(423) // is locked
        }


        // if user exist then encrement the signin attempt
        const forgotPassLT = userController.getLT(user, 'forgot-pass')
        const resetPassLT = userController.getLT(user, 'reset-pass')
        // encrement attempt
        if (resetPassLT) {
            user!.limitedTransactions.id(resetPassLT._id)!.attempts++
            await user.save()
            userController.cachedData.removeCacheData(user!._id) // remove cache
        }
        // check if signin is enable and also check for the attmpts compared to the limit
        if (!userController.isLTValid(user, 'reset-pass')) {
            throw(403) // Forbidden access to resources.
        }

        if (this.verifyLTKey(user, 'reset-pass', key)) {
            // check password exist before
            if (!await this.verifyPasswordNotYetUsed(user, newPassword)) throw(400) // Incorrect content in the request.

            // get current password
            const currPass = userController.geActivePassword(user)
            if (!Boolean(currPass)) throw(403) // Forbidden access to resources.
            // deactivate the current used password
            user.passwords.id(currPass!._id)!.isActive = false
            // set the new password with active status
            user.passwords.push({
                key: await Encryption.hashText(newPassword),
                isActive: true
            })

            // reset forgotPassLT
            if (forgotPassLT) {
                user.limitedTransactions.id(forgotPassLT._id)!.attempts = 0
            }
            if (resetPassLT) {
                user.limitedTransactions.id(resetPassLT._id)!.attempts = 0
                user.limitedTransactions.id(resetPassLT._id)!.key = ''
                user.limitedTransactions.id(resetPassLT._id)!.expTime = ''
            }

            await user!.save()
            userController.cachedData.removeCacheData(user!._id) // remove cache
            result = { message: 'Password has been changed.' }
        } else {
            throw(403) // Forbidden access to resources.
        }

        return result
    }

    // jwt:string
    public async signout(client:IClientDevice, authorization:string):Promise<{message:string} | null> {
        let resp:{message:string}|null = null
        if (!authorization || !client) throw(400)

        const type = authorization.split(' ')[0]
        const token = authorization.split(' ')[1]

        if (type && type === 'Bearer' && token) {

            const tokenObj = await Encryption.verifyJWT<{userId:string}>(token)
            if (!(tokenObj && tokenObj.userId)) throw(400)

            const user = await UserModel.findOne({ _id: tokenObj.userId, verified: true })
            if (!user) throw(400)

            const deviceId = userController.getDevice(user, client)?._id
            if (!deviceId) throw(400)

            const tokenId = userController.getToken(user.clientDevices.id(deviceId), token)?._id
            if (!tokenId) throw(400)

            user.clientDevices.id(deviceId)?.accessTokens?.id(tokenId)?.deleteOne()
            await user.save()
            userController.cachedData.removeCacheData(user._id)
            resp = { message: 'Successfull signout' }

        } else {
            throw(400) // Incorrect content in the request
        }

        // remove cache
        // userController.cachedData.removeCacheData(user._id)
        return resp
    }
}

export default new AuthController()