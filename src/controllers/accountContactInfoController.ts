import accountModel, { IAccount, IContactInfo, TContactInfoType } from '../dataSource/models/accountModel'
import accountController from './accountController'
import DataCleaner from '../utilities/dataCleaner'
// import Config from '../utilities/config'

// const env = Config.getEnv()

class AccountContactInfoController {
    public hasContactInfoValue(account:IAccount, contactInfoVal:string):boolean {
        if (account && account.contactInfos) {
            for (const info of account.contactInfos) {
                if (info.value === contactInfoVal) return true
            }
        }

        return false
    }

    public getContactInfoByValue(account:IAccount, contactInfoVal:string):IContactInfo|null {

        if (account && account.contactInfos) {
            for (const info of account.contactInfos) {
                if (info.value === contactInfoVal) return info
            }
        }

        return null
    }

    public getContactInfoById(account:IAccount, contactInfoId:string):IContactInfo|null {

        if (account && account.contactInfos) {
            for (const info of account.contactInfos) {
                if (info._id === contactInfoId) return info
            }
        }

        return null
    }

    public async getContactInfo(accountId:string, contactInfoId:string):Promise<IContactInfo|null> {
        if (!(accountId && contactInfoId)) throw({code: 400})

        const account = await accountController.getAccount({_id: accountId})
        if (!account) throw({code: 404})

        const contactInfo = this.getContactInfoById(account, contactInfoId)
        if (!contactInfo) throw({code: 404})

        return contactInfo
    }

    public async getContactInfos(accountId:string):Promise<IContactInfo[]> {
        let result:IContactInfo[] = []
        if (!accountId) throw({code: 400})

        const account = await accountController.getAccount({_id: accountId})
        if (!account) throw({code: 404})
        result = account!.contactInfos? account!.contactInfos: []

        return result
    }

    public async saveContactInfo(accountId:string, type:TContactInfoType, value:string, countryCode:string, verified:boolean|string):Promise<IContactInfo|null> {
        if (!(accountId && type && value)) throw({code: 400})

        const account = await accountModel.findOne({_id: accountId})
        if (!account) throw({code: 404})

        // check if the contact info to save is existing on the account contact infos
        if (this.hasContactInfoValue(account, value)) throw({code: 409})

        const doc:{type:TContactInfoType, value:string, countryCode?:string, verified?:boolean} = {type, value}
        if (countryCode) doc.countryCode = countryCode
        if (DataCleaner.getBooleanData(verified).isValid) {
            doc.verified = DataCleaner.getBooleanData(verified).data
        }
        account.contactInfos!.push(doc)

        await account.save()
        await accountController.cachedData.removeCacheData(accountId)

        return this.getContactInfoByValue(account, value)
    }

    public async updateContactInfo(accountId:string, contactInfoId:string, type:TContactInfoType, value:string, countryCode:string, verified:boolean|string):Promise<IContactInfo|null> {
        if (!(accountId && contactInfoId)) throw({code: 400})

        const account = await accountModel.findOne({_id: accountId})
        if (!account) throw({code: 404})
        if (!account.contactInfos?.id(contactInfoId)) throw({code: 404})

        if (type) account.contactInfos!.id(contactInfoId)!.type = type
        if (value) account.contactInfos!.id(contactInfoId)!.value = value
        if (countryCode) account.contactInfos!.id(contactInfoId)!.countryCode = countryCode
        if (DataCleaner.getBooleanData(verified).isValid) {
            account.contactInfos!.id(contactInfoId)!.verified = DataCleaner.getBooleanData(verified).data
        }

        await account.save()
        await accountController.cachedData.removeCacheData(accountId)

        return account.contactInfos!.id(contactInfoId)
    }

    public async deleteContactInfo(accountId:string, contactInfoId:string):Promise<IContactInfo|null> {
        if (!(accountId && contactInfoId)) throw({code: 400})

        const account = await accountModel.findOne({_id: accountId})
        if (!account) throw({code: 404})

        const accountInfoData = account!.contactInfos?.id(contactInfoId)
        if (accountInfoData) {
            account!.contactInfos?.id(contactInfoId)?.deleteOne()
            await account.save()
            await accountController.cachedData.removeCacheData(accountId)
        } else {
            throw({code: 404})
        }

        return accountInfoData? accountInfoData: null
    }
}

export default new AccountContactInfoController()