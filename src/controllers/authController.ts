
import UserModel, { IUser } from '../dataSource/models/userModel'
import userController from '../controllers/userController'
import Encryption from '../utilities/encryption'
// import Config from '../utilities/config'

// const env = Config.getEnv()

interface ISigninResult {
    userInfo: IUser,
    jwt: string
}

class AuthController {
    public async verifyPassword(user:IUser|null, password:string):Promise<boolean> {
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

    public async signin(username:string, password:string, ua:UAParser|null, ip:string|null):Promise<string | null> {

        // fetch user using the username
        const user = await UserModel.findOne({ username })

        // get the current password
        const isMatch = await this.verifyPassword(user, password)
        const jwtStr = (user && isMatch)? await Encryption.generateJWT({userId: user._id}): ''

        // if a match, set user authentication related data
        // credential match
        if (user && isMatch) {
            console.log(user)
            console.log(ua)
            console.log(jwtStr)
            console.log(ip)

        // Throw error when user does not exist or password not match
        } else {
            throw(400) // Incorrect content in the request.
        }

        return jwtStr
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
    public async signout():Promise<boolean | null> {
        // check the validity of jwt, then get user info inside jwt

        // chek if th user exist

        // then check if the device exist in the user

        // then check for the jwt record inside user -> device -> tokens

        // then remove the jwt

        // then return boolean, true if successfully signed out
        // const userReq = new DataRequest(UserModel)
        // const result = await userReq.getItem<IUser>()

        return null
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