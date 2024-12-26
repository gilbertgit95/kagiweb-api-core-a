import { Document } from 'mongoose'
import accountModel, { IAccount, IAccountAccountRef } from '../dataSource/models/accountModel'
import accountController from './accountController'
import DataCleaner from '../utilities/dataCleaner'
import appEvents from '../utilities/appEvents'
// import Config from '../utilities/config'

// const env = Config.getEnv()

class AccountAccountRefController {

    public getAccountRefById(account:IAccount, accountRefId:string):IAccountAccountRef|null {

        if (account && account.accountRefs) {
            for (const accountRef of account.accountRefs) {
                if (accountRef._id === accountRefId) return accountRef
            }
        }

        return null
    }

    public getAccountRefByAccountId(account:IAccount, accountId:string):IAccountAccountRef|null {

        if (account && account.accountRefs) {
            for (const accountRef of account.accountRefs) {
                if (accountRef.accountId === accountId) return accountRef
            }
        }

        return null
    }

    public async getAccountRef(accountId:string, accountRefId:string):Promise<IAccountAccountRef & {nameId?:string}|null> {
        if (!(accountId && accountRefId)) throw({code: 400})

        const account = await accountController.getAccount({_id: accountId})
        if (!account) throw({code: 404})

        const accountRef:IAccountAccountRef & {nameId?:string}|null = this.getAccountRefById(account, accountRefId)
        if (!accountRef) throw({code: 404})

        const accountData = await accountController.getAccount({_id: accountRef.accountId})
        accountRef.nameId = accountData?.nameId

        return accountRef
    }

    public async getAccountRefs(accountId:string):Promise<(IAccountAccountRef & {nameId?:string})[]> {
        if (!accountId) throw({code: 400})

        const account = await accountController.getAccount({_id: accountId})
        if (!account) throw({code: 404})

        let accountRefs:(IAccountAccountRef & {nameId?:string})[] = account?.accountRefs? account.accountRefs: []

        const accountsData = await accountModel.find({_id: {$in: accountRefs.map(item => item.accountId)}})
        const accountDataMap = accountsData.reduce((acc:{[key:string]:IAccount}, item) => {
            acc[item._id] = item
            return acc
        }, {})

        return accountRefs.map(item => {
            item.nameId = accountDataMap[item.accountId].nameId
            return item
        })
    }

    public async saveAccountAccountRef(
            accountId:string,
            nameId:string,
            disabled:boolean|string
        ):Promise<IAccountAccountRef|null> {

        if (!(accountId && nameId)) throw({code: 400})

        const account = await accountModel.findOne({_id: accountId})
        const assignedAccount = await accountModel.findOne({nameId})

        console.log('test: ', account?.nameId, assignedAccount?.nameId)
        if (!account) throw({code: 404})
        if (!assignedAccount) throw({code: 404, message: `${ nameId } does not exist!`})
        if (account._id === assignedAccount._id) throw({code: 409, message: 'cannot assign the account owner'})
        if (this.getAccountRefByAccountId(account, assignedAccount._id)) throw({code: 409, message: `${ nameId } was already assigned to this account!`})

        const doc:any = {
            accountId: assignedAccount._id,
            accountConfigs: [
                {
                    key: 'default-role',
                    value: '',
                    type: 'string'
                }
            ]
        }

        if (DataCleaner.getBooleanData(disabled).isValid) {
            doc.disabled = DataCleaner.getBooleanData(disabled).data
        }
        account.accountRefs?.push(doc)

        await account.save()
        await accountController.cachedData.removeCacheData(accountId)

        // emit event
        appEvents.emit('account-update', {
            action: 'add',
            account: account,
            assignedAccount,
            workspace: null
        })

        const lastIndex = account.accountRefs!.length - 1
        return account.accountRefs![lastIndex]
    }

    public async updateAccountAccountRef(
            accountId:string,
            accountRefId:string,
            disabled:boolean|string
        ):Promise<IAccountAccountRef|null> {

        if (!(accountId && accountRefId)) throw({code: 400})

        const account = await accountModel.findOne({_id: accountId})
        if (!account) throw({code: 404})
        if (!this.getAccountRefById(account, accountRefId)) throw({code: 404})

        await account.save()
        await accountController.cachedData.removeCacheData(accountId)

        return account.accountRefs!.id(accountRefId)
    }

    public async deleteAccountAccountRef(accountId:string, accountRefId:string):Promise<IAccountAccountRef|null> {
        if (!accountId) throw({code: 400})

        const account = await accountModel.findOne({_id: accountId})
        if (!account) throw({code: 404})

        const accountRefData = this.getAccountRefById(account, accountRefId)
        if (accountRefData) {
            account.accountRefs!.id(accountRefId)?.deleteOne()
            await account.save()
            await accountController.cachedData.removeCacheData(accountId)

            const assignedAccount = await accountModel.findOne({_id: accountRefData.accountId})

            // emit event
            appEvents.emit('account-update', {
                action: 'remove',
                account: account,
                assignedAccount,
                workspace: null
            })
        } else {
            throw({code: 404})
        }

        return accountRefData? accountRefData: null
    }
}

export default new AccountAccountRefController()