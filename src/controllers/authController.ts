import UserModel, { IUser, IClientDevice, IAccessToken } from '../dataSource/models/userModel'
import userController from '../controllers/userController'
import Encryption from '../utilities/encryption'
// import Config from '../utilities/config'

// const env = Config.getEnv()

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

    public async signin(username:string, password:string, device:IClientDevice, ip:string):Promise<{token?: string, userId?: string} | null> {

        // fetch user using the username
        let user = await UserModel.findOne({ username })
        let result:{token?: string, userId?: string} | null


        // if no user found
        if (!user) {
            throw(404) // resource not found
        }
        if (user && user.disabled) {
            throw(423) // is locked
        }


        // if user exist then encrement the signin attempt
        let signinLT = userController.getLimitedTransaction(user, 'signin')
        let newTotalAttempts:number = 0
        // encrement attempt
        if (signinLT) {
            newTotalAttempts = user.limitedTransactions.id(signinLT._id)!.attempts + 1
            user.limitedTransactions.id(signinLT._id)!.attempts = newTotalAttempts
            await user.save()
            userController.cachedData.removeCacheData(user!._id) // remove cache
        }
        // check if signin is enable and also check for the attmpts compared to the limit
        if (signinLT && signinLT.limit < newTotalAttempts) {
            user.disabled = true
            await user.save()
            userController.cachedData.removeCacheData(user!._id) // remove cache
            throw(423) // is locked
        }


        // if a match, set user authentication related data
        // credential match
        if (await this.verifyPassword(user, password)) {

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
    public async signinOTP():Promise<ISigninResult | null> {
        // chech user using the userId ifexist
        // then check code it exist and is valid

        // then if the device is not yet registered, then register the device
        // then generate jwt for the device with ip address info

        // then return user info and the generated jwt
        // const userReq = new DataRequest(UserModel)
        // const result = await userReq.getItem<IUser>()

        return null
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

            const user = await UserModel.findOne({ _id: tokenObj.userId })
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
            throw(400)
        }

        // remove cache
        // userController.cachedData.removeCacheData(user._id)
        return resp
    }

    public async signup():Promise<IUser | null> {
        // const userReq = new DataRequest(UserModel)

        // const result = await userReq.getItem<IUser>()

        return null
    }

    public async forgotPassword():Promise<IUser | null> {
        // const userReq = new DataRequest(UserModel)

        // const result = await userReq.getItem<IUser>()

        return null
    }

    public async resetPassword():Promise<IUser | null> {
        // const userReq = new DataRequest(UserModel)

        // const result = await userReq.getItem<IUser>()

        return null
    }
}

export default new AuthController()