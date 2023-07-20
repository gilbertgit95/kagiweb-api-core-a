import UserModel, { IUser } from '../dataSource/models/userModel'
import DataRequest from '../utilities/dataQuery'
// import Config from '../utilities/config'

// const env = Config.getEnv()

interface ISigninResult {
    userInfo: IUser,
    jwt: string
}

class AuthController {
    // userData:IUser, userAgent:string, ipAddress:string 
    public async signin():Promise<ISigninResult | null> {
        // get user using username

        // if it exist then check password if it match

        // if user 2fa is enabled then return user info and send generated otp via contact address

        // then if the device is not yet registered, then register the device
        // then generate jwt for the device with ip address info

        // then return user info and the generated jwt

        const userReq = new DataRequest(UserModel)
        const result = await userReq.getItem()

        return result
    }

    // userId:string, code:string
    public async signinOTP():Promise<ISigninResult | null> {
        // chech user using the userId ifexist
        // then check code it exist and is valid

        // then if the device is not yet registered, then register the device
        // then generate jwt for the device with ip address info

        // then return user info and the generated jwt
        const userReq = new DataRequest(UserModel)
        const result = await userReq.getItem()

        return result
    }

    // jwt:string
    public async signout():Promise<boolean | null> {
        // check the validity of jwt, then get user info inside jwt

        // chek if th user exist

        // then check if the device exist in the user

        // then check for the jwt record inside user -> device -> tokens

        // then remove the jwt

        // then return boolean, true if successfully signed out
        const userReq = new DataRequest(UserModel)
        const result = await userReq.getItem()

        return result
    }

    public async signup():Promise<IUser | null> {
        const userReq = new DataRequest(UserModel)

        const result = await userReq.getItem()

        return result
    }

    public async forgotPassword():Promise<IUser | null> {
        const userReq = new DataRequest(UserModel)

        const result = await userReq.getItem()

        return result
    }

    public async resetPassword():Promise<IUser | null> {
        const userReq = new DataRequest(UserModel)

        const result = await userReq.getItem()

        return result
    }
}

export default new AuthController()