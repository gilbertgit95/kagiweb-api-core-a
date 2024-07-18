import UserModel, { IAccount, IContactInfo, TContactInfoType } from '../dataSource/models/userModel'
import userController from './userController'
import DataCleaner from '../utilities/dataCleaner'
// import Config from '../utilities/config'

// const env = Config.getEnv()

class UserContactInfoController {
    public hasContactInfoValue(user:IAccount, contactInfoVal:string):boolean {
        if (user && user.contactInfos) {
            for (const info of user.contactInfos) {
                if (info.value === contactInfoVal) return true
            }
        }

        return false
    }

    public getContactInfoByValue(user:IAccount, contactInfoVal:string):IContactInfo|null {

        if (user && user.contactInfos) {
            for (const info of user.contactInfos) {
                if (info.value === contactInfoVal) return info
            }
        }

        return null
    }

    public getContactInfoById(user:IAccount, contactInfoId:string):IContactInfo|null {

        if (user && user.contactInfos) {
            for (const info of user.contactInfos) {
                if (info._id === contactInfoId) return info
            }
        }

        return null
    }

    public async getContactInfo(userId:string, contactInfoId:string):Promise<IContactInfo|null> {
        if (!(userId && contactInfoId)) throw({code: 400})

        const user = await userController.getUser({_id: userId})
        if (!user) throw({code: 404})

        const contactInfo = this.getContactInfoById(user, contactInfoId)
        if (!contactInfo) throw({code: 404})

        return contactInfo
    }

    public async getContactInfos(userId:string):Promise<IContactInfo[]> {
        let result:IContactInfo[] = []
        if (!userId) throw({code: 400})

        const user = await userController.getUser({_id: userId})
        if (!user) throw({code: 404})
        result = user!.contactInfos? user!.contactInfos: []

        return result
    }

    public async saveContactInfo(userId:string, type:TContactInfoType, value:string, countryCode:string, verified:boolean|string):Promise<IContactInfo|null> {
        if (!(userId && type && value)) throw({code: 400})

        const user = await UserModel.findOne({_id: userId})
        if (!user) throw({code: 404})

        // check if the contact info to save is existing on the user contact infos
        if (this.hasContactInfoValue(user, value)) throw({code: 409})

        const doc:{type:TContactInfoType, value:string, countryCode?:string, verified?:boolean} = {type, value}
        if (countryCode) doc.countryCode = countryCode
        if (DataCleaner.getBooleanData(verified).isValid) {
            doc.verified = DataCleaner.getBooleanData(verified).data
        }
        user.contactInfos!.push(doc)

        await user.save()
        await userController.cachedData.removeCacheData(userId)

        return this.getContactInfoByValue(user, value)
    }

    public async updateContactInfo(userId:string, contactInfoId:string, type:TContactInfoType, value:string, countryCode:string, verified:boolean|string):Promise<IContactInfo|null> {
        if (!(userId && contactInfoId)) throw({code: 400})

        const user = await UserModel.findOne({_id: userId})
        if (!user) throw({code: 404})
        if (!user.contactInfos?.id(contactInfoId)) throw({code: 404})

        if (type) user.contactInfos!.id(contactInfoId)!.type = type
        if (value) user.contactInfos!.id(contactInfoId)!.value = value
        if (countryCode) user.contactInfos!.id(contactInfoId)!.countryCode = countryCode
        if (DataCleaner.getBooleanData(verified).isValid) {
            user.contactInfos!.id(contactInfoId)!.verified = DataCleaner.getBooleanData(verified).data
        }

        await user.save()
        await userController.cachedData.removeCacheData(userId)

        return user.contactInfos!.id(contactInfoId)
    }

    public async deleteContactInfo(userId:string, contactInfoId:string):Promise<IContactInfo|null> {
        if (!(userId && contactInfoId)) throw({code: 400})

        const user = await UserModel.findOne({_id: userId})
        if (!user) throw({code: 404})

        const userInfoData = user!.contactInfos?.id(contactInfoId)
        if (userInfoData) {
            user!.contactInfos?.id(contactInfoId)?.deleteOne()
            await user.save()
            await userController.cachedData.removeCacheData(userId)
        } else {
            throw({code: 404})
        }

        return userInfoData? userInfoData: null
    }
}

export default new UserContactInfoController()