import moment from 'moment'
import UserModel, { IClientDevice, IAccessToken, IContactInfo } from '../dataSource/models/userModel'
import TextValidators from '../dataSource/validators/textValidators'
import userController from './userController'
import userLimitedTransactionController from './userLimitedTransactionController'
import userClientDeviceController from './userClientDeviceController'
import userPasswordController from './userPasswordController'
import userClientDeviceAccessTokenController from './userClientDeviceAccessTokenController'
import roleController from './roleController'

import Encryption from '../utilities/encryption'
import Config from '../utilities/config'

const env = Config.getEnv()

class AuthController {
    public async signin(username:string, password:string, device:IClientDevice, ip:string):Promise<{token?: string, username?: string, message?: string} | null> {

        // fetch user using the username
        let user = await UserModel.findOne({ username, verified: true })
        let result:{token?: string, username?: string, message?: string} | null


        // if no user found
        if (!user) {
            throw({code: 404}) // resource not found
        }
        if (user && user.disabled) {
            throw({code: 423}) // is locked
        }


        // if user exist then encrement the signin attempt
        const signinLT = userLimitedTransactionController.getLimitedTransactionByType(user, 'signin')
        // encrement attempt
        if (signinLT) {
            user.limitedTransactions.id(signinLT._id)!.attempts++
            await user.save()
            userController.cachedData.removeCacheData(user!._id) // remove cache
        }
        // check if signin is enable and also check for the attmpts compared to the limit
        if (!userLimitedTransactionController.isLimitedTransactionValid(user, 'signin')) {
            user.disabled = true
            await user.save()
            userController.cachedData.removeCacheData(user!._id) // remove cache
            throw({code: 423}) // is locked
        }


        // if a match, set user authentication related data
        // credential match
        if (await userPasswordController.verifyActivePassword(user, password)) {
            // check LT of otp-signin
            const otpSigninLT = userLimitedTransactionController.getLimitedTransactionByType(user, 'otp-signin')
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
                return { username: user.username, message: 'OTP has been sent' }
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
            let deviceId = userClientDeviceController.getClientDeviceByUA(user!, device?.ua)?._id
            // if device exist, push the new token to the existing device
            if (!deviceId) {
                user!.clientDevices.push(device)
                user = await user!.save()
                deviceId = userClientDeviceController.getClientDeviceByUA(user, device?.ua)?._id
            }
            user!.clientDevices.id(deviceId)?.accessTokens?.push(accessToken)
            result = {token: jwtStr, message: 'Successfull signin'}

            // reset signinLT
            if (signinLT) {
                user.limitedTransactions.id(signinLT._id)!.attempts = 0
            }

            await user!.save()
            userController.cachedData.removeCacheData(user!._id) // remove cache

            // clean invalid access tokens
            await userClientDeviceAccessTokenController.removeInvalidTokens(user._id)

        // Throw error when user does not exist or password not match
        } else {
            throw({code: 404}) // Resource not found
        }

        return result
    }

    // userId:string, code:string
    public async signinOTP(username:string, key:string, device:IClientDevice, ip:string):Promise<{token: string, message?: string } | null> {
        // fetch user using the username
        let user = await UserModel.findOne({ username, verified: true })
        let result:{ token: string, message?: string } | null


        // if no user found
        if (!user) {
            throw({code: 403}) // Forbidden access to resources.
        }
        if (user && user.disabled) {
            throw({code: 423}) // is locked
        }


        // if user exist then encrement the signin attempt
        const signinLT = userLimitedTransactionController.getLimitedTransactionByType(user, 'signin')
        const otpSigninLT = userLimitedTransactionController.getLimitedTransactionByType(user, 'otp-signin')
        // encrement attempt
        if (otpSigninLT) {
            user!.limitedTransactions.id(otpSigninLT._id)!.attempts++
            await user.save()
            userController.cachedData.removeCacheData(user!._id) // remove cache
        }
        // check if signin is enable and also check for the attmpts compared to the limit
        if (!userLimitedTransactionController.isLimitedTransactionValid(user, 'otp-signin')) {
            throw({code: 403}) // Forbidden access to resources.
        }

        if (userLimitedTransactionController.verifyLimitedTransactionKey(user, 'otp-signin', key)) {
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
            let deviceId = userClientDeviceController.getClientDeviceByUA(user!, device?.ua)?._id
            // if device exist, push the new token to the existing device
            if (!deviceId) {
                user!.clientDevices.push(device)
                user = await user!.save()
                deviceId = userClientDeviceController.getClientDeviceByUA(user, device?.ua)?._id
            }
            user!.clientDevices.id(deviceId)?.accessTokens?.push(accessToken)
            result = {token: jwtStr, message: 'Successfull signin'}

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

            // clean invalid access tokens
            await userClientDeviceAccessTokenController.removeInvalidTokens(user!._id)
        } else {
            throw({code: 403}) // Forbidden access to resources.
        }

        return result
    }

    public async signup(username:string, password:string, email?:string, phone?:string):Promise<{message:string}> {
        const contactinfos:IContactInfo[] = []
        // check username and password exist
        if (!(username && password)) throw({code: 400}) // Incorrect content in the request
        // check username is unique
        if (await UserModel.findOne({username})) throw({code: 409}) // conflict

        // validate data here ---->>>

        // if email exist check if email is unique then generate email contact info
        if (email) {
            if (await UserModel.findOne({'contactInfos.value': email})) {
                throw({code: 409}) // conflict
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
                throw({code: 409}) // conflict
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

    public async forgotPassword(username:string):Promise<{ username:string, message?:string } | null> {
        // fetch user using the username
        const user = await UserModel.findOne({ username, verified: true })
        let result:{ username: string, message?: string } | null = null


        // if no user found
        if (!user) {
            throw({code: 404}) // resource not found
        }
        if (user && user.disabled) {
            throw({code: 423}) // is locked
        }


        // if user exist then encrement the forgot-pass attempt
        const resetPassLT = userLimitedTransactionController.getLimitedTransactionByType(user, 'reset-pass')
        const forgotPassLT = userLimitedTransactionController.getLimitedTransactionByType(user, 'forgot-pass')
        // encrement attempt
        if (forgotPassLT) {
            user!.limitedTransactions.id(forgotPassLT._id)!.attempts++
            await user.save()
            userController.cachedData.removeCacheData(user!._id) // remove cache
        }
        // check if forgot-pass is enable and also check for the attmpts compared to the limit
        if (!userLimitedTransactionController.isLimitedTransactionValid(user, 'forgot-pass')) {
            user.disabled = true
            await user.save()
            userController.cachedData.removeCacheData(user!._id) // remove cache
            throw({code: 423}) // is locked
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
            result = { username: user.username, message: 'Password reset key has been sent' }
        } else {
            throw({code: 404}) // resource not found
        }

        return result
    }

    public async resetPassword(username:string, key:string, newPassword:string):Promise<{ message: string } | null> {
        // fetch user using the username
        const user = await UserModel.findOne({ username, verified: true })
        let result:{ message: string } | null = null


        // if no user found
        if (!user) {
            throw({code: 403}) // Forbidden access to resources.
        }
        if (user && user.disabled) {
            throw({code: 423}) // is locked
        }


        // if user exist then encrement the signin attempt
        const forgotPassLT = userLimitedTransactionController.getLimitedTransactionByType(user, 'forgot-pass')
        const resetPassLT = userLimitedTransactionController.getLimitedTransactionByType(user, 'reset-pass')
        // encrement attempt
        if (resetPassLT) {
            user!.limitedTransactions.id(resetPassLT._id)!.attempts++
            await user.save()
            userController.cachedData.removeCacheData(user!._id) // remove cache
        }
        // check if signin is enable and also check for the attmpts compared to the limit
        if (!userLimitedTransactionController.isLimitedTransactionValid(user, 'reset-pass')) {
            throw({code: 403}) // Forbidden access to resources.
        }

        if (userLimitedTransactionController.verifyLimitedTransactionKey(user, 'reset-pass', key)) {
            // check password exist before
            if (await userPasswordController.hasPasswordEntry(user, newPassword)) throw({code: 400}) // Incorrect content in the request.

            // check the new password pattern
            if (!TextValidators.validatePassword.validator(newPassword)) {
                throw({
                    code: 400,
                    message: TextValidators.validatePassword.message({value: newPassword})
                })
            }

            // get current password
            const currPass = userPasswordController.getActivePassword(user)
            if (!currPass) throw({code: 403}) // Forbidden access to resources.
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
            throw({code: 403}) // Forbidden access to resources.
        }

        return result
    }

    // jwt:string
    public async signout(client:IClientDevice, authorization:string):Promise<{message:string} | null> {
        let resp:{message:string}|null = null
        if (!authorization || !client) throw({code: 400})

        const type = authorization.split(' ')[0]
        const token = authorization.split(' ')[1]

        if (type && type === 'Bearer' && token) {

            const tokenObj = await Encryption.verifyJWT<{userId:string}>(token)
            if (!(tokenObj && tokenObj.userId)) throw({code: 400})

            const user = await UserModel.findOne({ _id: tokenObj.userId, verified: true })
            if (!user) throw({code: 400})

            const deviceId = userClientDeviceController.getClientDeviceByUA(user, client?.ua)?._id
            if (!deviceId) throw({code: 400})

            const tokenId = userClientDeviceAccessTokenController.getClientDeviceAccessTokenByJWT(user, deviceId, token)?._id
            if (!tokenId) throw({code: 400})

            user.clientDevices.id(deviceId)?.accessTokens?.id(tokenId)?.deleteOne()
            await user.save()
            userController.cachedData.removeCacheData(user._id)

            resp = { message: 'Successfull signout' }

        } else {
            throw({code: 400}) // Incorrect content in the request
        }

        // remove cache
        // userController.cachedData.removeCacheData(user._id)
        return resp
    }
}

export default new AuthController()