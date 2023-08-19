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
        const currPasswords = user?.passwords
            .filter(pass => pass.type === 'current')
        const currPassword = (
               currPasswords
            && currPasswords.length
            && currPasswords[0].key
        )? currPasswords[0]: undefined

        // match password
        let passwordMatch = false
        if (user && currPassword) {
            passwordMatch = await Encryption
                .verifyTextToHash(password, currPassword.key)
        }

        return passwordMatch
    }

    public async signin(username:string, password:string, device:IClientDevice, ip:string):Promise<{token: string} | null> {

        // fetch user using the username
        let user = await UserModel.findOne({ username })
        // get the current password
        const isMatch = user? await this.verifyPassword(user, password): false
        let jwtStr = null

        // if a match, set user authentication related data
        // credential match
        if (user && isMatch) {
            jwtStr = await Encryption.generateJWT({userId: user._id})
            const accessToken:IAccessToken = {
                jwt: jwtStr,
                ipAddress: ip,
                disabled: false
            }

            // assign access token to device
            // get device 
            let deviceId = userController.getDevice(user, device)
            // if device exist, push the new token to the existing device
            if (!deviceId) {
                user.clientDevices.push(device)
                user = await user.save()
                deviceId = userController.getDevice(user, device)
            }
            user.clientDevices.id(deviceId)?.accessTokens?.push(accessToken)

            await user.save()

            // remove cache
            userController.cachedData.removeCacheData(user._id)

        // Throw error when user does not exist or password not match
        } else {
            throw(400) // Incorrect content in the request.
        }

        return {token: jwtStr}
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

            const deviceId = userController.getDevice(user, client)
            if (!deviceId) throw(400)

            const tokenId = userController.getToken(user.clientDevices.id(deviceId), token)
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