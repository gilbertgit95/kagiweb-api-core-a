import UserModel, { IUser, IPassword } from '../dataSource/models/userModel'
import userController from './userController'
import Encryption from '../utilities/encryption'
// import Config from '../utilities/config'

// const env = Config.getEnv()

class UserPasswordController {
    public async hasPasswordEntry(user:IUser, password:string):Promise<boolean> {
        if (user && user.passwords) {
            for (let pass of user.passwords) {
                if (await Encryption.verifyTextToHash(password, pass.key)) return true
            }
        }

        return false
    }

    public async getPasswordEntry(user:IUser, password:string):Promise<IPassword|null> {

        if (user && user.passwords) {
            for (let pass of user.passwords) {
                if (await Encryption.verifyTextToHash(password, pass.key)) return pass
            }
        }

        return null
    }

    public async getActivePassword(user:IUser):Promise<IPassword|null> {

        if (user && user.passwords) {
            for (let pass of user.passwords) {
                if (pass.isActive) return pass
            }
        }

        return null
    }

    public getPasswordById(user:IUser, passwordId:string):IPassword|null {

        if (user && user.passwords) {
            for (let pass of user.passwords) {
                if (pass._id === passwordId) return pass
            }
        }

        return null
    }

    public async getPassword(userId:string, passwordId:string):Promise<IPassword|null> {
        if (!(userId && passwordId)) throw({code: 400})

        const user = await userController.getUser({_id: userId})
        if (!user) throw({code: 404})

        const password = this.getPasswordById(user, passwordId)
        if (!password) throw({code: 404})
        password.key = 'NA'
        return password
    }

    public async getPasswords(userId:string):Promise<IPassword[]> {
        let result:IPassword[] = []
        if (!userId) throw({code: 400})

        const user = await userController.getUser({_id: userId})
        if (!user) throw({code: 404})
        result = user!.passwords? user!.passwords: []
        // remove key values
        result = result.map(item => {
            item.key = 'NA'
            return item
        })

        return result
    }

    public async savePassword(userId:string, currentPassword:string, newPassword:string):Promise<IPassword|null> {
        if (!(userId && currentPassword && newPassword)) throw({code: 400})

        const user = await UserModel.findOne({_id: userId})
        if (!user) throw({code: 404})

        const currPass = await this.getActivePassword(user)
        if (!currPass) throw({code: 404})

        // verify if the current password provided is true
        if (!(currPass.key && await Encryption.verifyTextToHash(currentPassword, currPass.key))) {
            throw({code: 404})
        }

        // check if the contact info to save is existing on the user contact infos
        if (await this.hasPasswordEntry(user, newPassword)) throw({code: 409})

        // save the new password with active status
        user.passwords!.push({isActive: true, key: await Encryption.hashText(newPassword)})

        // deactivate the current password
        user.passwords.id(currPass._id)!.isActive = false

        await user.save()
        await userController.cachedData.removeCacheData(userId)

        const passEntry = await this.getPasswordEntry(user, newPassword)
        if (passEntry && passEntry.key) passEntry.key = 'NA'
        return passEntry
    }

    public async deletePassword(userId:string, passwordId:string):Promise<IPassword|null> {
        if (!(userId && passwordId)) throw({code: 400})

        const user = await UserModel.findOne({_id: userId})
        if (!user) throw({code: 404})

        const userPasswordData = user!.passwords?.id(passwordId)
        // check if password is active
        if (userPasswordData && userPasswordData.isActive) throw({code: 409})

        if (userPasswordData) {
            user!.passwords?.id(passwordId)?.deleteOne()
            await user.save()
            await userController.cachedData.removeCacheData(userId)
        } else {
            throw({code: 404})
        }

        userPasswordData.key = 'NA'
        return userPasswordData
    }
}

export default new UserPasswordController()