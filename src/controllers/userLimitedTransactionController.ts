import moment from 'moment'
import UserModel, { IUser, ILimitedTransaction } from '../dataSource/models/userModel'
import userController from './userController'
import DataCleaner from '../utilities/dataCleaner'
// import Config from '../utilities/config'

// const env = Config.getEnv()

class UserLimitedTransactionController {
    public verifyLimitedTransactionKey(user:IUser, lt:string, key:string):boolean {
        let result = false

        const ltData = this.getLimitedTransactionByType(user, lt)

        if (ltData && !ltData.disabled && ltData.key === key) result = true

        return result
    }

    public isLimitedTransactionValid(user:IUser, lt:string):boolean {
        let ltData:ILimitedTransaction|undefined

        // get limited transaction
        user.limitedTransactions.forEach(item => {
            if (item.type === lt && !item.disabled) {
                ltData = item
            }
        })

        // checker if no lt exist
        // checker if lt is disabled
        if (ltData && ltData.disabled) {
            // checker if attempts is higher than the limit
            if (ltData.limit < ltData.attempts) return false
            // time expiration checker, current time versus time in expTime
            if (ltData.expTime) {
                const currTime = moment()
                const ltTime = moment(ltData.expTime)
                // check time is valid
                // then check if curren time is greater than the ltTime
                if (ltTime.isValid() && currTime.isAfter(ltTime)) return false
            }
        }

        return true
    }

    public hasLimitedTransactionType(user:IUser, limitedTransactionType:string):boolean {
        if (user && user.limitedTransactions) {
            for (const lt of user.limitedTransactions) {
                if (lt.type === limitedTransactionType) return true
            }
        }

        return false
    }

    public getLimitedTransactionByType(user:IUser, limitedTransactionType:string):ILimitedTransaction|null {

        if (user && user.limitedTransactions) {
            for (const lt of user.limitedTransactions) {
                if (lt.type === limitedTransactionType) return lt
            }
        }

        return null
    }

    public getLimitedTransactionById(user:IUser, limitedTransactionId:string):ILimitedTransaction|null {

        if (user && user.limitedTransactions) {
            for (const lt of user.limitedTransactions) {
                if (lt._id === limitedTransactionId) return lt
            }
        }

        return null
    }

    public async getLimitedTransaction(userId:string, limitedTransactionId:string):Promise<ILimitedTransaction|null> {
        if (!(userId && limitedTransactionId)) throw({code: 400})

        const user = await userController.getUser({_id: userId})
        if (!user) throw({code: 404})

        const userInfo = this.getLimitedTransactionById(user, limitedTransactionId)
        if (!userInfo) throw({code: 404})

        return userInfo
    }

    public async getLimitedTransactions(userId:string):Promise<ILimitedTransaction[]> {
        let result:ILimitedTransaction[] = []
        if (!userId) throw({code: 400})

        const user = await userController.getUser({_id: userId})
        if (!user) throw({code: 404})
        result = user!.limitedTransactions? user!.limitedTransactions: []

        return result
    }

    public async updateLimitedTransaction(
        userId:string, limitedTransactionId:string,
        limit:number, attempts:number, key:string,
        value:string, recipient:string,
        disabled:boolean|string
    ):Promise<ILimitedTransaction|null> {
        if (!(userId && limitedTransactionId)) throw({code: 400})

        const user = await UserModel.findOne({_id: userId})
        if (!user) throw({code: 404})
        if (!user.limitedTransactions?.id(limitedTransactionId)) throw({code: 404})

        if (limit) user.limitedTransactions!.id(limitedTransactionId)!.limit = limit
        if (attempts) user.limitedTransactions!.id(limitedTransactionId)!.attempts = attempts
        if (key) user.limitedTransactions!.id(limitedTransactionId)!.key = key
        if (value) user.limitedTransactions!.id(limitedTransactionId)!.value = value
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