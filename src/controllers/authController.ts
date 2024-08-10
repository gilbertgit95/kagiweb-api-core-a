import moment from 'moment'
import accountModel, { IClientDevice, IAccessToken, IContactInfo, acountTypes } from '../dataSource/models/accountModel'
import TextValidators from '../dataSource/validators/textValidators'
import accountController from './accountController'
import accountLimitedTransactionController from './accountLimitedTransactionController'
import accountClientDeviceController from './accountClientDeviceController'
import accountPasswordController from './accountPasswordController'
import accountClientDeviceAccessTokenController from './accountClientDeviceAccessTokenController'
import roleController from './roleController'
import Encryption from '../utilities/encryption'
import Config from '../utilities/config'
import appEvents from '../utilities/appEvents'

const env = Config.getEnv()

class AuthController {
    public async signin(username:string, password:string, device:IClientDevice, ip:string):Promise<{token?: string, username?: string, message?: string} | null> {

        // fetch account using the username
        let account = await accountModel.findOne({ username, verified: true, accountType: 'account' })
        let result:{token?: string, username?: string, message?: string} | null

        // if no account found
        if (!account) {
            throw({code: 404}) // resource not found
        }
        if (account && account.disabled) {
            throw({code: 423}) // is locked
        }


        // if account exist then encrement the signin attempt
        const signinLT = accountLimitedTransactionController.getLimitedTransactionByType(account, 'signin')
        // encrement attempt
        if (signinLT) {
            account.limitedTransactions.id(signinLT._id)!.attempts++
            await account.save()
            accountController.cachedData.removeCacheData(account!._id) // remove cache
        }
        // check if signin is enable and also check for the attmpts compared to the limit
        if (!accountLimitedTransactionController.isLimitedTransactionValid(account, 'signin')) {
            account.disabled = true
            await account.save()
            accountController.cachedData.removeCacheData(account!._id) // remove cache
            throw({code: 423}) // is locked
        }


        // if a match, set account authentication related data
        // credential match
        if (await accountPasswordController.verifyActivePassword(account, password)) {
            // check if is expired
            if (accountPasswordController.isActivePasswordExpired(account)) throw({code: 403, message: 'Password is expired'}) // Forbidden access to resources.

            // check LT of otp-signin
            const otpSigninLT = accountLimitedTransactionController.getLimitedTransactionByType(account, 'otp-signin')
            if (otpSigninLT && !otpSigninLT.disabled) {
                // create randnom key and expiration time
                const otpKey:string = Encryption.generateRandNumber().toString()
                const expTime:Date = moment()
                    .add(env.DafaultAccountLTExpiration, 'minutes')
                    .toDate()

                // reset otp-signin with the random key
                account.limitedTransactions.id(otpSigninLT._id)!.attempts = 0
                account.limitedTransactions.id(otpSigninLT._id)!.key = otpKey
                account.limitedTransactions.id(otpSigninLT._id)!.expTime = expTime

                await account.save()
                // send otp to the LT recepient
                // console.log(`System is sending signin otp to ${ signinLT!.recipient } with key ${ otpKey }`)
                appEvents.emit('otp', {
                    module: 'signin',
                    device: device,
                    ip: ip,
                    account: account,
                    lt: otpSigninLT
                })
                // then return accountId
                return { username: account.username, message: 'OTP has been sent' }
            }

            // normal signin
            const jwtStr = Encryption.generateJWT({accountId: account!._id})
            const exp = (await Encryption.verifyJWT<{accountId:string}>(jwtStr))?.exp
            const expTime = exp? new Date(exp * 1e3): undefined

            const accessToken:IAccessToken = {
                jwt: jwtStr,
                ipAddress: ip,
                expTime,
                disabled: false
            }

            // assign access token to device
            // get device 
            let deviceId = accountClientDeviceController.getClientDeviceByUA(account!, device?.ua)?._id
            // if device exist, push the new token to the existing device
            if (!deviceId) {
                account!.clientDevices.push(device)
                account = await account!.save()
                deviceId = accountClientDeviceController.getClientDeviceByUA(account, device?.ua)?._id
            }
            account!.clientDevices.id(deviceId)?.accessTokens?.push(accessToken)
            result = {token: jwtStr, message: 'Successfull signin'}

            // reset signinLT
            if (signinLT) {
                account.limitedTransactions.id(signinLT._id)!.attempts = 0
            }

            await account!.save()
            accountController.cachedData.removeCacheData(account!._id) // remove cache

            // clean invalid access tokens
            await accountClientDeviceAccessTokenController.removeInvalidTokens(account._id)

        // Throw error when account does not exist or password not match
        } else {
            throw({code: 404}) // Resource not found
        }

        return result
    }

    // accountId:string, code:string
    public async signinOTP(username:string, key:string, device:IClientDevice, ip:string):Promise<{token: string, message?: string } | null> {
        // fetch account using the username
        let account = await accountModel.findOne({ username, verified: true, accountType: 'account' })
        let result:{ token: string, message?: string } | null

        // if no account found
        if (!account) {
            throw({code: 403}) // Forbidden access to resources.
        }
        if (account && account.disabled) {
            throw({code: 423}) // is locked
        }

        // if account exist then encrement the signin attempt
        const signinLT = accountLimitedTransactionController.getLimitedTransactionByType(account, 'signin')
        const otpSigninLT = accountLimitedTransactionController.getLimitedTransactionByType(account, 'otp-signin')
        // encrement attempt
        if (otpSigninLT) {
            account!.limitedTransactions.id(otpSigninLT._id)!.attempts++
            await account.save()
            accountController.cachedData.removeCacheData(account!._id) // remove cache
        }
        // check if signin is enable and also check for the attmpts compared to the limit
        if (!accountLimitedTransactionController.isLimitedTransactionValid(account, 'otp-signin')) {
            throw({code: 403}) // Forbidden access to resources.
        }

        if (accountLimitedTransactionController.verifyLimitedTransactionKey(account, 'otp-signin', key)) {
            // then if the device is not yet registered, then register the device
            // then generate jwt for the device with ip address info
            // then return account info and the generated jwt
            // normal signin
            const jwtStr = await Encryption.generateJWT({accountId: account!._id})
            const exp = (await Encryption.verifyJWT<{accountId:string}>(jwtStr))?.exp
            const expTime = exp? new Date(exp * 1e3): undefined

            const accessToken:IAccessToken = {
                jwt: jwtStr,
                ipAddress: ip,
                expTime,
                disabled: false
            }

            // assign access token to device
            // get device 
            let deviceId = accountClientDeviceController.getClientDeviceByUA(account!, device?.ua)?._id
            // if device exist, push the new token to the existing device
            if (!deviceId) {
                account!.clientDevices.push(device)
                account = await account!.save()
                deviceId = accountClientDeviceController.getClientDeviceByUA(account, device?.ua)?._id
            }
            account!.clientDevices.id(deviceId)?.accessTokens?.push(accessToken)
            result = {token: jwtStr, message: 'Successfull signin'}

            // reset signinLT
            if (signinLT) {
                account.limitedTransactions.id(signinLT._id)!.attempts = 0
            }
            if (otpSigninLT) {
                account.limitedTransactions.id(otpSigninLT._id)!.attempts = 0
                account.limitedTransactions.id(otpSigninLT._id)!.key = ''
                account.limitedTransactions.id(otpSigninLT._id)!.expTime = undefined
            }

            await account!.save()
            accountController.cachedData.removeCacheData(account!._id) // remove cache

            // clean invalid access tokens
            await accountClientDeviceAccessTokenController.removeInvalidTokens(account!._id)
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
        if (await accountModel.findOne({username})) throw({code: 409}) // conflict

        // if email exist check if email is unique then generate email contact info
        if (email) {
            if (await accountModel.findOne({'contactInfos.value': email})) {
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
            if (await accountModel.findOne({'contactInfos.value': phone})) {
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

        // create new account entry data with default data
        // set the contact informations
        // set the password
        const account = {
            accountType: acountTypes[0],
            username,
            rolesRefs: role? [{roleId: role._id, isActive: true}]: [],
            accountInfo: [],
            passwords: [
                {
                    key: await Encryption.hashText(password),
                    expTime: moment().add(env.DefaultPasswordExpiration, 'days').toDate(),
                    isActive: true
                }
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

        // then save the new account to the database
        const createdAccount = await accountModel.create(account)

        // emit event to verify account !soon todo
        appEvents.emit('account-created', {
            device: null,
            ip: null,
            account: null,
            lt: null,
            module: 'signup',
            createdAccount: createdAccount,
            password: password
        })

        return { message: 'Account successfully created' }
    }

    public async forgotPassword(username:string, device:IClientDevice, ip:string):Promise<{ username:string, message?:string } | null> {
        // fetch account using the username
        const account = await accountModel.findOne({ username, verified: true, accountType: 'account' })
        let result:{ username: string, message?: string } | null = null


        // if no account found
        if (!account) {
            throw({code: 404}) // resource not found
        }
        if (account && account.disabled) {
            throw({code: 423}) // is locked
        }


        // if account exist then encrement the forgot-pass attempt
        const resetPassLT = accountLimitedTransactionController.getLimitedTransactionByType(account, 'reset-pass')
        const forgotPassLT = accountLimitedTransactionController.getLimitedTransactionByType(account, 'forgot-pass')
        // encrement attempts
        if (forgotPassLT) {
            account!.limitedTransactions.id(forgotPassLT._id)!.attempts++
            await account.save()
            accountController.cachedData.removeCacheData(account!._id) // remove cache
        }
        // check if forgot-pass is enable and also check for the attmpts compared to the limit
        if (!accountLimitedTransactionController.isLimitedTransactionValid(account, 'forgot-pass')) {
            account.disabled = true
            await account.save()
            accountController.cachedData.removeCacheData(account!._id) // remove cache
            throw({code: 423}) // is locked
        }

        if (resetPassLT && !resetPassLT.disabled) {
            const otpKey:string = Encryption.generateRandNumber().toString()
            const expTime:Date = moment()
                .add(env.DafaultAccountLTExpiration, 'minutes')
                .toDate()

            // reset otp-signin with the random key
            account.limitedTransactions.id(resetPassLT._id)!.attempts = 0
            account.limitedTransactions.id(resetPassLT._id)!.key = otpKey
            account.limitedTransactions.id(resetPassLT._id)!.expTime = expTime
            await account.save()
            // send otp to the LT recepient
            // console.log(`System is sending password reset otp to ${ resetPassLT!.recipient } with key ${ otpKey }`)
            appEvents.emit('otp', {
                module: 'reset-password',
                device: device,
                ip: ip,
                account: account,
                lt: resetPassLT
            })
            
            // then return accountId
            result = { username: account.username, message: 'Password reset key has been sent' }
        } else {
            throw({code: 404}) // resource not found
        }

        return result
    }

    public async resetPassword(username:string, key:string, newPassword:string):Promise<{ message: string } | null> {
        // fetch account using the username
        const account = await accountModel.findOne({ username, verified: true, accountType: 'account' })
        let result:{ message: string } | null = null


        // if no account found
        if (!account) {
            throw({code: 403}) // Forbidden access to resources.
        }
        if (account && account.disabled) {
            throw({code: 423}) // is locked
        }


        // if account exist then encrement the signin attempt
        const forgotPassLT = accountLimitedTransactionController.getLimitedTransactionByType(account, 'forgot-pass')
        const resetPassLT = accountLimitedTransactionController.getLimitedTransactionByType(account, 'reset-pass')
        // encrement attempt
        if (resetPassLT) {
            account!.limitedTransactions.id(resetPassLT._id)!.attempts++
            await account.save()
            accountController.cachedData.removeCacheData(account!._id) // remove cache
        }
        // check if signin is enable and also check for the attmpts compared to the limit
        if (!accountLimitedTransactionController.isLimitedTransactionValid(account, 'reset-pass')) {
            throw({code: 403}) // Forbidden access to resources.
        }

        if (accountLimitedTransactionController.verifyLimitedTransactionKey(account, 'reset-pass', key)) {
            // check password exist before
            if (await accountPasswordController.hasPasswordEntry(account, newPassword)) throw({code: 400}) // Incorrect content in the request.

            // check the new password pattern
            if (!TextValidators.validatePassword.validator(newPassword)) {
                throw({
                    code: 400,
                    message: TextValidators.validatePassword.message({value: newPassword})
                })
            }

            // get current password
            const currPass = accountPasswordController.getActivePassword(account)
            if (!currPass) throw({code: 403}) // Forbidden access to resources.
            // deactivate the current used password
            account.passwords.id(currPass!._id)!.isActive = false
            // set the new password with active status
            account.passwords.push({
                key: await Encryption.hashText(newPassword),
                isActive: true
            })

            // reset forgotPassLT
            if (forgotPassLT) {
                account.limitedTransactions.id(forgotPassLT._id)!.attempts = 0
            }
            if (resetPassLT) {
                account.limitedTransactions.id(resetPassLT._id)!.attempts = 0
                account.limitedTransactions.id(resetPassLT._id)!.key = ''
                account.limitedTransactions.id(resetPassLT._id)!.expTime = undefined
            }

            await account!.save()
            accountController.cachedData.removeCacheData(account!._id) // remove cache
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

            const tokenObj = await Encryption.verifyJWT<{accountId:string}>(token)
            if (!(tokenObj && tokenObj.accountId)) throw({code: 400})

            const account = await accountModel.findOne({ _id: tokenObj.accountId, verified: true })
            if (!account) throw({code: 400})

            const deviceId = accountClientDeviceController.getClientDeviceByUA(account, client?.ua)?._id
            if (!deviceId) throw({code: 400})

            const tokenId = accountClientDeviceAccessTokenController.getClientDeviceAccessTokenByJWT(account, deviceId, token)?._id
            if (!tokenId) throw({code: 400})

            account.clientDevices.id(deviceId)?.accessTokens?.id(tokenId)?.deleteOne()
            await account.save()
            accountController.cachedData.removeCacheData(account._id)

            resp = { message: 'Successfull signout' }

        } else {
            throw({code: 400}) // Incorrect content in the request
        }

        // remove cache
        // accountController.cachedData.removeCacheData(account._id)
        return resp
    }
}

export default new AuthController()