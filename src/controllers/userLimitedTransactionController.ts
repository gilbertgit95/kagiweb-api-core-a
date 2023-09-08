import UserModel, { IUser, ILimitedTransaction, TLimitedTransactionType } from '../dataSource/models/userModel'
import userController from './userController'
import DataCleaner from '../utilities/dataCleaner'
// import Config from '../utilities/config'

// const env = Config.getEnv()

class UserLimitedTransactionController {
    public hasLimitedTransactionType(user:IUser, limitedTransactionType:string):boolean {
        if (user && user.limitedTransactions) {
            for (let lt of user.limitedTransactions) {
                if (lt.type === limitedTransactionType) return true
            }
        }

        return false
    }

    public getLimitedTransactionByType(user:IUser, limitedTransactionType:string):ILimitedTransaction|null {

        if (user && user.limitedTransactions) {
            for (let lt of user.limitedTransactions) {
                if (lt.type === limitedTransactionType) return lt
            }
        }

        return null
    }

    public getLimitedTransactionById(user:IUser, limitedTransactionId:string):ILimitedTransaction|null {

        if (user && user.limitedTransactions) {
            for (let lt of user.limitedTransactions) {
                if (lt._id === limitedTransactionId) return lt
            }
        }

        return null
    }

    public async getLimitedTransaction(userId:string, limitedTransactionId:string):Promise<ILimitedTransaction|null> {
        if (!(userId && limitedTransactionId)) throw(400)

        const user = await userController.getUser({_id: userId})
        if (!user) throw(404)

        const userInfo = this.getLimitedTransactionById(user, limitedTransactionId)
        if (!userInfo) throw(404)

        return userInfo
    }

    public async getLimitedTransactions(userId:string):Promise<ILimitedTransaction[]> {
        let result:ILimitedTransaction[] = []
        if (!userId) throw(400)

        const user = await userController.getUser({_id: userId})
        if (!user) throw(404)
        result = user!.limitedTransactions? user!.limitedTransactions: []

        return result
    }

    public async updateLimitedTransaction(
        userId:string, limitedTransactionId:string,
        limit:number, attempts:number, key:string,
        value:string, expTime:string, recipient:string,
        disabled:boolean|string
    ):Promise<ILimitedTransaction|null> {
        if (!(userId && limitedTransactionId)) throw(400)

        const user = await UserModel.findOne({_id: userId})
        if (!user) throw(404)
        if (!user.limitedTransactions?.id(limitedTransactionId)) throw(404)

        if (limit) user.limitedTransactions!.id(limitedTransactionId)!.limit = limit
        if (attempts) user.limitedTransactions!.id(limitedTransactionId)!.attempts = attempts
        if (key) user.limitedTransactions!.id(limitedTransactionId)!.key = key
        if (value) user.limitedTransactions!.id(limitedTransactionId)!.value = value
        if (expTime) user.limitedTransactions!.id(limitedTransactionId)!.expTime = expTime
        if (recipient) user.limitedTransactions!.id(limitedTransactionId)!.recipient = recipient
        if (DataCleaner.getBooleanData(disabled).isValid) {
            user.limitedTransactions!.id(limitedTransactionId)!.disabled = DataCleaner.getBooleanData(disabled).data
        }

        await user.save()
        await userController.cachedData.removeCacheData(userId)

        return user.limitedTransactions!.id(limitedTransactionId)
    }
}

export default new UserLimitedTransactionController()