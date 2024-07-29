import moment from 'moment'
import accountModel, { IAccount, IPassword } from '../dataSource/models/userModel'
import TextValidators from '../dataSource/validators/textValidators'
import userController from './userController'
import Encryption from '../utilities/encryption'
import Config from '../utilities/config'

const env = Config.getEnv()

class UserPasswordController {
    /**
     * 
     * @param {Object} account - is account object
     * @param {string} password - plain text password
     * @returns {boolean}
     */
    public async verifyActivePassword(account:IAccount, password:string):Promise<boolean> {
        const currPassword = this.getActivePassword(account)
        return currPassword? await Encryption.verifyTextToHash(password, currPassword.key):false
    }

    public isActivePasswordExpired(account:IAccount):boolean {
        const currPassword = this.getActivePassword(account)

        const currTime = moment()
        if (currPassword?.expTime && currTime.isAfter(moment(currPassword.expTime))) {
            return true
        }
        return false
    }

    public async hasPasswordEntry(account:IAccount, password:string):Promise<boolean> {
        if (account && account.passwords) {
            for (const pass of account.passwords) {
                if (await Encryption.verifyTextToHash(password, pass.key)) return true
            }
        }

        return false
    }

    public async getPasswordEntry(account:IAccount, password:string):Promise<IPassword|null> {

        if (account && account.passwords) {
            for (const pass of account.passwords) {
                if (await Encryption.verifyTextToHash(password, pass.key)) return pass
            }
        }

        return null
    }

    public getActivePassword(account:IAccount):IPassword|null {

        if (account && account.passwords) {
            for (const pass of account.passwords) {
                if (pass.isActive) return pass
            }
        }

        return null
    }

    public getPasswordById(account:IAccount, passwordId:string):IPassword|null {

        if (account && account.passwords) {
            for (const pass of account.passwords) {
                if (pass._id === passwordId) return pass
            }
        }

        return null
    }

    public async getPassword(accountId:string, passwordId:string):Promise<IPassword|null> {
        if (!(accountId && passwordId)) throw({code: 400})

        const account = await userController.getUser({_id: accountId})
        if (!account) throw({code: 404})

        const password = this.getPasswordById(account, passwordId)
        if (!password) throw({code: 404})
        return password
    }

    public async getPasswords(accountId:string):Promise<IPassword[]> {
        let result:IPassword[] = []
        if (!accountId) throw({code: 400})

        const account = await userController.getUser({_id: accountId})
        if (!account) throw({code: 404})
        result = account!.passwords? account!.passwords: []

        return result
    }

    public async savePassword(accountId:string, currentPassword:string, newPassword:string):Promise<IPassword|null> {
        if (!(accountId && currentPassword && newPassword)) throw({code: 400})

        const account = await accountModel.findOne({_id: accountId})
        if (!account) throw({code: 404})

        const currPass = await this.getActivePassword(account)
        if (!currPass) throw({code: 404})

        // verify if the current password is provided
        if (!(currPass.key && await Encryption.verifyTextToHash(currentPassword, currPass.key))) {
            throw({code: 404})
        }

        // check the new password pattern
        if (!TextValidators.validatePassword.validator(newPassword)) {
            throw({
                code: 400,
                message: TextValidators.validatePassword.message({value: newPassword})
            })
        }


        // check if the password to save is existing on the account passwords
        if (await this.hasPasswordEntry(account, newPassword)) throw({code: 409})

        // save the new password with active status
        account.passwords!.push({
            isActive: true,
            key: await Encryption.hashText(newPassword),
            expTime: moment().add(env.DefaultPasswordExpiration, 'days').toDate()
        })

        // deactivate the current password
        account.passwords.id(currPass._id)!.isActive = false

        await account.save()
        await userController.cachedData.removeCacheData(accountId)

        const passEntry = await this.getPasswordEntry(account, newPassword)
        // if (passEntry && passEntry.key) passEntry.key = 'NA'
        return passEntry
    }

    public async deletePassword(accountId:string, passwordId:string):Promise<IPassword|null> {
        if (!(accountId && passwordId)) throw({code: 400})

        const account = await accountModel.findOne({_id: accountId})
        if (!account) throw({code: 404})

        const accountPasswordData = account!.passwords?.id(passwordId)
        // check if password is active
        if (accountPasswordData && accountPasswordData.isActive) throw({code: 409})

        if (accountPasswordData) {
            account!.passwords?.id(passwordId)?.deleteOne()
            await account.save()
            await userController.cachedData.removeCacheData(accountId)
        } else {
            throw({code: 404})
        }

        // accountPasswordData.key = 'NA'
        return accountPasswordData
    }
}

export default new UserPasswordController()