import moment from 'moment'
import accountModel, { IAccount, ILimitedTransaction } from '../dataSource/models/accountModel'
import userController from './accountController'
import DataCleaner from '../utilities/dataCleaner'
// import Config from '../utilities/config'

// const env = Config.getEnv()

class UserLimitedTransactionController {
    public verifyLimitedTransactionKey(account:IAccount, lt:string, key:string):boolean {
        let result = false

        const ltData = this.getLimitedTransactionByType(account, lt)

        if (ltData && !ltData.disabled && ltData.key === key) result = true

        return result
    }

    public isLimitedTransactionValid(account:IAccount, lt:string):boolean {
        let ltData:ILimitedTransaction|undefined

        // get limited transaction
        account.limitedTransactions.forEach(item => {
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

    public hasLimitedTransactionType(account:IAccount, limitedTransactionType:string):boolean {
        if (account && account.limitedTransactions) {
            for (const lt of account.limitedTransactions) {
                if (lt.type === limitedTransactionType) return true
            }
        }

        return false
    }

    public getLimitedTransactionByType(account:IAccount, limitedTransactionType:string):ILimitedTransaction|null {

        if (account && account.limitedTransactions) {
            for (const lt of account.limitedTransactions) {
                if (lt.type === limitedTransactionType) return lt
            }
        }

        return null
    }

    public getLimitedTransactionById(account:IAccount, limitedTransactionId:string):ILimitedTransaction|null {

        if (account && account.limitedTransactions) {
            for (const lt of account.limitedTransactions) {
                if (lt._id === limitedTransactionId) return lt
            }
        }

        return null
    }

    public async getLimitedTransaction(accountId:string, limitedTransactionId:string):Promise<ILimitedTransaction|null> {
        if (!(accountId && limitedTransactionId)) throw({code: 400})

        const account = await userController.getUser({_id: accountId})
        if (!account) throw({code: 404})

        const accountInfo = this.getLimitedTransactionById(account, limitedTransactionId)
        if (!accountInfo) throw({code: 404})

        return accountInfo
    }

    public async getLimitedTransactions(accountId:string):Promise<ILimitedTransaction[]> {
        let result:ILimitedTransaction[] = []
        if (!accountId) throw({code: 400})

        const account = await userController.getUser({_id: accountId})
        if (!account) throw({code: 404})
        result = account!.limitedTransactions? account!.limitedTransactions: []

        return result
    }

    public async updateLimitedTransaction(
        accountId:string, limitedTransactionId:string,
        limit:number, attempts:number, key:string,
        value:string, recipient:string,
        disabled:boolean|string
    ):Promise<ILimitedTransaction|null> {
        if (!(accountId && limitedTransactionId)) throw({code: 400})

        const account = await accountModel.findOne({_id: accountId})
        if (!account) throw({code: 404})
        if (!account.limitedTransactions?.id(limitedTransactionId)) throw({code: 404})

        if (limit) account.limitedTransactions!.id(limitedTransactionId)!.limit = limit
        if (attempts) account.limitedTransactions!.id(limitedTransactionId)!.attempts = attempts
        if (key) account.limitedTransactions!.id(limitedTransactionId)!.key = key
        if (value) account.limitedTransactions!.id(limitedTransactionId)!.value = value
        if (recipient) account.limitedTransactions!.id(limitedTransactionId)!.recipient = recipient
        if (DataCleaner.getBooleanData(disabled).isValid) {
            account.limitedTransactions!.id(limitedTransactionId)!.disabled = DataCleaner.getBooleanData(disabled).data
        }

        await account.save()
        await userController.cachedData.removeCacheData(accountId)

        return account.limitedTransactions!.id(limitedTransactionId)
    }
}

export default new UserLimitedTransactionController()