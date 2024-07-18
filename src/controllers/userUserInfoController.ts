import UserModel, { IAccount, IAccountInfo, TAccountInfoType } from '../dataSource/models/userModel'
import userController from './userController'
// import Config from '../utilities/config'

// const env = Config.getEnv()

class UserUserInfoController {
    public hasUserInfoKey(user:IAccount, userInfoKey:string):boolean {
        if (user && user.userInfos) {
            for (const info of user.userInfos) {
                if (info.key === userInfoKey) return true
            }
        }

        return false
    }

    public getUserInfoByKey(user:IAccount, userInfoKey:string):IAccountInfo|null {

        if (user && user.userInfos) {
            for (const info of user.userInfos) {
                if (info.key === userInfoKey) return info
            }
        }

        return null
    }

    public getUserInfoById(user:IAccount, userInfoId:string):IAccountInfo|null {

        if (user && user.userInfos) {
            for (const info of user.userInfos) {
                if (info._id === userInfoId) return info
            }
        }

        return null
    }

    public async getUserInfo(userId:string, userInfoId:string):Promise<IAccountInfo|null> {
        if (!(userId && userInfoId)) throw({code: 400})

        const user = await userController.getUser({_id: userId})
        if (!user) throw({code: 404})

        const userInfo = this.getUserInfoById(user, userInfoId)
        if (!userInfo) throw({code: 404})

        return userInfo
    }

    public async getUserInfos(userId:string):Promise<IAccountInfo[]> {
        let result:IAccountInfo[] = []
        if (!userId) throw({code: 400})

        const user = await userController.getUser({_id: userId})
        if (!user) throw({code: 404})
        result = user!.userInfos? user!.userInfos: []

        return result
    }

    public async saveUserInfo(userId:string, key:string, value:string, type:string):Promise<IAccountInfo|null> {
        if (!(userId && key && value && type)) throw({code: 400})

        const user = await UserModel.findOne({_id: userId})
        if (!user) throw({code: 404})

        // check if the user info to save is existing on the user user infos
        if (this.hasUserInfoKey(user, key)) throw({code: 409})

        user.userInfos!.push({key, value, type})

        await user.save()
        await userController.cachedData.removeCacheData(userId)

        return this.getUserInfoByKey(user, key)
    }

    public async updateUserInfo(userId:string, userInfoId:string, key:string, value:string, type:TAccountInfoType):Promise<IAccountInfo|null> {
        if (!(userId && userInfoId)) throw({code: 400})

        const user = await UserModel.findOne({_id: userId})
        if (!user) throw({code: 404})
        if (!user.userInfos?.id(userInfoId)) throw({code: 404})

        if (key) user.userInfos!.id(userInfoId)!.key = key
        if (value) user.userInfos!.id(userInfoId)!.value = value
        if (type) user.userInfos!.id(userInfoId)!.type = type

        await user.save()
        await userController.cachedData.removeCacheData(userId)

        return user.userInfos!.id(userInfoId)
    }

    public async deleteUserInfo(userId:string, userInfoId:string):Promise<IAccountInfo|null> {
        if (!(userId && userInfoId)) throw({code: 400})

        const user = await UserModel.findOne({_id: userId})
        if (!user) throw({code: 404})

        const userInfoData = user!.userInfos?.id(userInfoId)
        if (userInfoData) {
            user!.userInfos?.id(userInfoId)?.deleteOne()
            await user.save()
            await userController.cachedData.removeCacheData(userId)
        } else {
            throw({code: 404})
        }

        return userInfoData? userInfoData: null
    }
}

export default new UserUserInfoController()