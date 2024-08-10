import moment from 'moment'
import DataCache from '../utilities/dataCache'
import accountModel, { IAccount, IPassword, IAccessToken, IClientDevice, IWorkspace, IAccountQuery } from '../dataSource/models/accountModel'
import DataRequest, { IListOutput, IPgeInfo } from '../utilities/dataQuery'
import roleController from './roleController'
import featureController from './featureController'
import userWorkspaceController from './accountWorkspaceController'

import Encryption from '../utilities/encryption'
import DataCleaner from '../utilities/dataCleaner'
import { IFeature } from '../dataSource/models/featureModel'
import { IRole } from '../dataSource/models/roleModel'
import userRoleController from './accountRoleController'
import appEvents from '../utilities/appEvents'
import Config from '../utilities/config'

const env = Config.getEnv()

interface IAccountCompleteInfo {
    accountData: IAccount|null,
    role: IRole|null,
    roles: IRole[]|null,
    features: IFeature[]|null,
    workspace: IWorkspace|null,
    workspaces: IWorkspace[]|null,
    externalWorkspaces: (IWorkspace & {ownerId:string, ownerUsername: string})[]|null
}

class UserController {
    public cachedData:DataCache
    public request:DataRequest

    constructor() {
        this.cachedData = new DataCache(accountModel, { stdTTL: 30, checkperiod: 15 })
        this.request = new DataRequest(accountModel)
    }

    public clearSensitiveInfo(account:IAccount):IAccount {
        // clean passwords
        account.passwords.forEach((item:IPassword) => {
            item.key = 'NA'
        })
    
        // clean client devices access tokens
        account.clientDevices.forEach((item:IClientDevice) => {
            item.accessTokens?.forEach((at:IAccessToken) => {
                const tkn = at.jwt
                const size = 5
                at.jwt = tkn? tkn.substring(0, size) + '***' + tkn.substring(tkn.length - size, tkn.length): 'NA'
            })
        })
    
        return account
    }

    public async getAccountCompleteInfo(query:IAccountQuery, includeSensitiveInfo=false):Promise<IAccountCompleteInfo> {
        const resp:IAccountCompleteInfo = {
            accountData: null,
            role: null,
            roles: null,
            features: null,
            workspace: null,
            workspaces: null,
            externalWorkspaces: null
        }
        if (query._id) {
            let account = await this.cachedData.getItem<IAccount>(query._id)
            if (account && !includeSensitiveInfo) account = this.clearSensitiveInfo(account)
            if (account) {
                const rolesMap = await roleController.getRolesMap()
                const activeRoleRef = userRoleController.getActiveRoleRef(account)
                const activeRole = activeRoleRef? rolesMap[activeRoleRef.roleId]: null
                const userRoles = account?.rolesRefs.map(item => rolesMap[item.roleId])

                const featuresMap = await featureController.getFeaturesMap()
                let roleFeatures = activeRole?.featuresRefs?.map(item => featuresMap[item.featureId]) || null
                if (activeRole?.absoluteAuthority) {
                    roleFeatures = await featureController.getAllFeatures()
                }

                resp.role = activeRole
                resp.roles = userRoles
                resp.features = roleFeatures
                resp.workspace = userWorkspaceController.getActiveWorkspace(account)
                resp.workspaces = account.workspaces
                resp.externalWorkspaces = await userWorkspaceController.getExternalWorkspaces(account._id!)
                resp.accountData = account
            }
        }
        return resp
    }

    public async getUser(query:IAccountQuery, includeSensitiveInfo=false):Promise<IAccount|null> {
        if (!query._id) return null
        let account = await this.cachedData.getItem<IAccount>(query._id)
        if (account && !includeSensitiveInfo) account = this.clearSensitiveInfo(account)
        return account
    }

    public async getAllUsers(includeSensitiveInfo=false):Promise<IAccount[]> {
        let accounts = await this.cachedData.getAllItems<IAccount>()
        if (accounts && !includeSensitiveInfo) accounts.forEach(account => {this.clearSensitiveInfo(account)})
        return accounts
    }

    public async getUsersByPage(query:IAccountQuery = {}, pageInfo: IPgeInfo):Promise<IListOutput<IAccount>> {
        let paginatedData = await this.request.getItemsByPage<IAccount>(query, {}, {}, pageInfo)
        if (paginatedData.items) {
            paginatedData.items.forEach(account => {this.clearSensitiveInfo(account)})
        }
        return paginatedData
    }

    public async saveUser(username:string, disabled:boolean|string, verified:boolean|string):Promise<IAccount | null> {
        // check username if already existing
        if (await accountModel.findOne({username})) throw({code: 409}) // conflict

        const role = await roleController.getLeastRole()
        const defautPass = Encryption.generateRandPassword()

        const doc:any = { // eslint-disable-line @typescript-eslint/no-explicit-any
            username,
            rolesRefs: role? [{roleId: role._id, isActive: true}]: [],
            accountInfo: [],
            passwords: [
                {
                    key: await Encryption.hashText(defautPass),
                    expTime: moment().add(env.DefaultPasswordExpiration, 'days').toDate(),
                    isActive: true
                }
            ],
            contactInfos: [],
            clientDevices: [],
            limitedTransactions: [
                { limit: 5, type: 'signin' },
                { limit: 5, type: 'otp-signin', disabled: true },
                { limit: 5, type: 'forgot-pass' },
                { limit: 5, type: 'reset-pass' },
                { limit: 5, type: 'verify-contact'}
            ]
        }

        if (DataCleaner.getBooleanData(disabled).isValid) {
            doc.disabled = DataCleaner.getBooleanData(disabled).data
        }
        if (DataCleaner.getBooleanData(verified).isValid) {
            doc.verified = DataCleaner.getBooleanData(verified).data
        }

        let account = await this.cachedData.createItem<IAccount>(doc)
        // callback event, after a account was created with its default password
        appEvents.emit('account-created', {
            device: null,
            ip: null,
            lt: null,
            account: null,
            module: 'admin',
            createdAccount: account,
            password: defautPass
        })
        
        if (account) account = this.clearSensitiveInfo(account)
        return account
    }

    public async updateUser(id:string, username:string, disabled:boolean|string, verified:boolean|string):Promise<IAccount | null> { // eslint-disable-line @typescript-eslint/no-explicit-any
        const doc:{username?:string, disabled?:boolean, verified?:boolean} = {}
        if (!id) return null
        // check username if already existing
        if (typeof username === 'string' && username.length) {
            if (await accountModel.findOne({username})) throw({code: 409}) // conflict
            doc.username = username
        }
        if (DataCleaner.getBooleanData(disabled).isValid) {
            doc.disabled = DataCleaner.getBooleanData(disabled).data
        }
        if (DataCleaner.getBooleanData(verified).isValid) {
            doc.verified = DataCleaner.getBooleanData(verified).data
        }

        // fetch the current account info
        const currAccountData = await this.cachedData.getItem<IAccount>(id)
        let account = await this.cachedData.updateItem<IAccount>(id, doc)
        if (account) account = this.clearSensitiveInfo(account)

        // then check for the particular properties would be changed
        // callback events if there are changes on the properties
        // changes in username property
        if (account && currAccountData && currAccountData.username !== account.username) {
            appEvents.emit('account-changed', {
                device: null,
                ip: null,
                lt: null,
                account: null,
                property: 'username',
                value: account.username,
                previousValue: currAccountData.username,
                changedAccount: account,
            })
        }
        // changes in verified property
        if (account && currAccountData && currAccountData.disabled !== account.disabled) {
            appEvents.emit('account-changed', {
                device: null,
                ip: null,
                lt: null,
                account: null,
                property: 'disabled',
                value: account.disabled,
                previousValue: currAccountData.disabled,
                changedAccount: account,
            })
        }
        // changes in disabled property
        if (account && currAccountData && currAccountData.verified !== account.verified) {
            appEvents.emit('account-changed', {
                device: null,
                ip: null,
                lt: null,
                account: null,
                property: 'verified',
                value: account.verified,
                previousValue: currAccountData.verified,
                changedAccount: account,
            })
        }
        return account
    }

    public async deleteUser(id:string):Promise<IAccount | null> {
        let account = await this.cachedData.deleteItem<IAccount>(id)
        if (account) account = this.clearSensitiveInfo(account)
        return account
    }
}

export {
    IAccountCompleteInfo
}
export default new UserController()