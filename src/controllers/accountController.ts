import moment from 'moment'
import DataCache from '../utilities/dataCache'
import accountModel, { IAccount, IPassword, IAccessToken, IClientDevice, IWorkspace, IAccountQuery } from '../dataSource/models/accountModel'
import DataRequest, { IListOutput, IPgeInfo } from '../utilities/dataQuery'
import roleController from './roleController'
import featureController from './featureController'
import accountWorkspaceController from './accountWorkspaceController'
import accountAccountConfigController from '../controllers/accountAccountConfigController'
import accountClientDeviceController from './accountClientDeviceController'
import accountClientDeviceAccessTokenController from './accountClientDeviceAccessTokenController'

import { generateDefaultAccountData } from '../utilities/defaultsData'
import Encryption from '../utilities/encryption'
import DataCleaner from '../utilities/dataCleaner'
import { IFeature } from '../dataSource/models/featureModel'
import { IRole } from '../dataSource/models/roleModel'
// import accountRoleController from './accountRoleController'
import appEvents from '../utilities/appEvents'
import Config from '../utilities/config'

const env = Config.getEnv()

interface IAccountCompleteInfo {
    accountData: IAccount|null,
    appRole: IRole|null,
    appRoles: IRole[]|null,
    appFeatures: IFeature[]|null,
    workspace: IWorkspace|null,
    workspaces: IWorkspace[]|null,
    externalWorkspaces: (IWorkspace & {ownerId:string, ownerNameId: string})[]|null,
    clientDevice: IClientDevice|null,
    accessToken: IAccessToken|null,

    visitedAccount?: IAccount|null,
    visitedAccountRole?: IRole|null,
    visitedAccountRoles?: IRole[]|null,
    visitedAccountWorkspace?: IWorkspace|null,
    visitedAccountWorkspaceRole?: IRole|null,
    visitedAccountWorkspaceRoles?: IRole[]|null,
}

class AccountController {
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

    public async getAccountCompleteInfo(query:{_id: string, ua?:string, token?:string}, includeSensitiveInfo=false):Promise<IAccountCompleteInfo> {
        const resp:IAccountCompleteInfo = {
            accountData: null,
            appRole: null,
            appRoles: null,
            appFeatures: null,
            workspace: null,
            workspaces: null,
            externalWorkspaces: null,
            clientDevice: null,
            accessToken: null,

            visitedAccount: null,
            visitedAccountRole: null,
            visitedAccountRoles: null,
            visitedAccountWorkspace: null,
            visitedAccountWorkspaceRole: null,
            visitedAccountWorkspaceRoles: null
        }
        if (query._id) {
            let account = await this.cachedData.getItem<IAccount>(query._id)
            if (account) {
                const rolesMap = await roleController.getRolesMap()
                const defaultConfigRole = accountAccountConfigController.getAccountConfigByKey(account, 'default-role')
                const defaultRole = defaultConfigRole? rolesMap[defaultConfigRole.value]: null
                const accountRoles = account?.rolesRefs.map(item => rolesMap[item.roleId])

                const featuresMap = await featureController.getFeaturesMap()
                let appRoleFeatures = defaultRole?.featuresRefs?.map(item => featuresMap[item.featureId]) || null
                if (defaultRole?.absoluteAuthority) {
                    appRoleFeatures = await featureController.getAllFeatures()
                }

                let usedClientDevice = query.ua? accountClientDeviceController.getClientDeviceByUA(account, query.ua): null
                let usedToken = query.token && usedClientDevice?._id? accountClientDeviceAccessTokenController.getClientDeviceAccessTokenByJWT(account, usedClientDevice._id, query.token): null
                // clear sensitive data
                if (usedClientDevice) usedClientDevice.accessTokens = undefined
                if (usedToken) usedToken.jwt = ''
                if (!includeSensitiveInfo) account = this.clearSensitiveInfo(account)

                const accountWorkspaces = account.workspaces
                const accountExtWorkspaces = await accountWorkspaceController.getExternalWorkspaces(account._id!)
                const allAccountWorkspaces = [...accountWorkspaces, ...accountExtWorkspaces]
                const allWorkspaceMap = allAccountWorkspaces.reduce<{[key:string]:IWorkspace}>((acc, item) => {
                    acc[item._id] = item
                    return acc
                }, {})
                const defaultConfigWorkspace = accountAccountConfigController.getAccountConfigByKey(account, 'default-workspace')
                const defaultWorkspace = allWorkspaceMap[defaultConfigWorkspace?.value || ''] || null

                resp.appRole = defaultRole
                resp.appRoles = accountRoles

                resp.appFeatures = appRoleFeatures
                resp.workspace = defaultWorkspace
                resp.workspaces = accountWorkspaces
                resp.externalWorkspaces = await accountWorkspaceController.getExternalWorkspaces(account._id!)
                resp.accountData = account
                resp.clientDevice = usedClientDevice
                resp.accessToken = usedToken

                resp.visitedAccount = null
                resp.visitedAccountRole = null
                resp.visitedAccountRoles = null
                resp.visitedAccountWorkspace = null
                resp.visitedAccountWorkspaceRole = null
                resp.visitedAccountWorkspaceRoles = null
            }
        }
        return resp
    }

    public async getAccount(query:IAccountQuery, includeSensitiveInfo=false):Promise<IAccount|null> {
        if (!query._id) return null
        let account = await this.cachedData.getItem<IAccount>(query._id)
        if (account && !includeSensitiveInfo) account = this.clearSensitiveInfo(account)
        return account
    }

    public async getAllAccounts(includeSensitiveInfo=false):Promise<IAccount[]> {
        let accounts = await this.cachedData.getAllItems<IAccount>()
        if (accounts && !includeSensitiveInfo) accounts.forEach(account => {this.clearSensitiveInfo(account)})
        return accounts
    }

    public async getAccountsByPage(query:any = {}, pageInfo: IPgeInfo):Promise<IListOutput<IAccount>> {
        // fetch accounts were the signedin account was assigned
        let paginatedData = await this.request.getItemsByPage<IAccount>(query, {}, {}, pageInfo)
        if (paginatedData.items) {
            paginatedData.items.forEach(account => {this.clearSensitiveInfo(account)})
        }
        return paginatedData
    }

    public async saveAccount(nameId:string, disabled:boolean|string, verified:boolean|string):Promise<IAccount | null> {
        // check nameId if already existing
        if (await accountModel.findOne({nameId})) throw({code: 409}) // conflict

        const defautPass = Encryption.generateRandPassword()

        let doc:any  = await generateDefaultAccountData()

        doc = {
            ...doc,
            ...{ // eslint-disable-line @typescript-eslint/no-explicit-any
                nameId,
                passwords: [
                    {
                        key: await Encryption.hashText(defautPass),
                        expTime: moment().add(env.DefaultPasswordExpiration, 'days').toDate(),
                        isActive: true
                    }
                ]
            }
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

    public async updateAccount(id:string, nameId:string, disabled:boolean|string, verified:boolean|string):Promise<IAccount | null> { // eslint-disable-line @typescript-eslint/no-explicit-any
        const doc:{nameId?:string, disabled?:boolean, verified?:boolean} = {}
        if (!id) return null
        // check nameId if already existing
        if (typeof nameId === 'string' && nameId.length) {
            if (await accountModel.findOne({nameId})) throw({code: 409}) // conflict
            doc.nameId = nameId
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
        // changes in nameId property
        if (account && currAccountData && currAccountData.nameId !== account.nameId) {
            appEvents.emit('account-changed', {
                device: null,
                ip: null,
                lt: null,
                account: null,
                property: 'nameId',
                value: account.nameId,
                previousValue: currAccountData.nameId,
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

    public async deleteAccount(id:string):Promise<IAccount | null> {
        let account = await this.cachedData.deleteItem<IAccount>(id)
        if (account) account = this.clearSensitiveInfo(account)
        return account
    }
}

export {
    IAccountCompleteInfo
}
export default new AccountController()