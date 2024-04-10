import DataCache from '../utilities/dataCache'
import UserModel, { IUser, IPassword, IAccessToken, IClientDevice, IWorkspace, IUserQuery } from '../dataSource/models/userModel'
import DataRequest, { IListOutput, IPgeInfo } from '../utilities/dataQuery'
import roleController from './roleController'
import featureController from './featureController'
import userWorkspaceController from './userWorkspaceController'

import Encryption from '../utilities/encryption'
import DataCleaner from '../utilities/dataCleaner'
import { IFeature } from '../dataSource/models/featureModel'
import { IRole } from '../dataSource/models/roleModel'
import userRoleController from './userRoleController'
import appEvents from '../utilities/appEvents'
// import Config from '../utilities/config'

// const env = Config.getEnv()
interface IUserCompleteInfo {
    userData: IUser|null,
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
        this.cachedData = new DataCache(UserModel, { stdTTL: 30, checkperiod: 15 })
        this.request = new DataRequest(UserModel)
    }

    public clearSensitiveInfo(user:IUser):IUser {
        // clean passwords
        user.passwords.forEach((item:IPassword) => {
            item.key = 'NA'
        })
    
        // clean client devices access tokens
        user.clientDevices.forEach((item:IClientDevice) => {
            item.accessTokens?.forEach((at:IAccessToken) => {
                at.jwt = 'NA'
            })
        })
    
        return user
    }

    public async getUserCompleteInfo(query:IUserQuery, includeSensitiveInfo=false):Promise<IUserCompleteInfo> {
        const resp:IUserCompleteInfo = {
            userData: null,
            role: null,
            roles: null,
            features: null,
            workspace: null,
            workspaces: null,
            externalWorkspaces: null
        }
        if (query._id) {
            let user = await this.cachedData.getItem<IUser>(query._id)
            if (user && !includeSensitiveInfo) user = this.clearSensitiveInfo(user)
            if (user) {
                const rolesMap = await roleController.getRolesMap()
                const activeRoleRef = userRoleController.getActiveRoleRef(user)
                const activeRole = activeRoleRef? rolesMap[activeRoleRef.roleId]: null
                const userRoles = user?.rolesRefs.map(item => rolesMap[item.roleId])

                const featuresMap = await featureController.getFeaturesMap()
                let roleFeatures = activeRole?.featuresRefs?.map(item => featuresMap[item._id]) || null
                if (activeRole?.absoluteAuthority) {
                    roleFeatures = await featureController.getAllFeatures()
                }

                resp.role = activeRole
                resp.roles = userRoles
                resp.features = roleFeatures
                resp.workspace = userWorkspaceController.getActiveWorkspace(user)
                resp.workspaces = user.workspaces
                resp.externalWorkspaces = await userWorkspaceController.getExternalWorkspaces(user._id!)
                resp.userData = user
            }
        }
        return resp
    }

    public async getUser(query:IUserQuery, includeSensitiveInfo=false):Promise<IUser|null> {
        if (!query._id) return null
        let user = await this.cachedData.getItem<IUser>(query._id)
        if (user && !includeSensitiveInfo) user = this.clearSensitiveInfo(user)
        return user
    }

    public async getAllUsers(includeSensitiveInfo=false):Promise<IUser[]> {
        let users = await this.cachedData.getAllItems<IUser>()
        if (users && !includeSensitiveInfo) users.forEach(user => {this.clearSensitiveInfo(user)})
        return users
    }

    public async getUsersByPage(query:IUserQuery = {}, pageInfo: IPgeInfo):Promise<IListOutput<IUser>> {
        let paginatedData = await this.request.getItemsByPage<IUser>(query, {}, {}, pageInfo)
        if (paginatedData.items) {
            paginatedData.items.forEach(user => {this.clearSensitiveInfo(user)})
        }
        return paginatedData
    }

    public async saveUser(username:string, disabled:boolean|string, verified:boolean|string):Promise<IUser | null> {
        // check username if already existing
        if (await UserModel.findOne({username})) throw({code: 409}) // conflict

        const role = await roleController.getLeastRole()
        const defautPass = Encryption.generateRandPassword()

        const doc:any = { // eslint-disable-line @typescript-eslint/no-explicit-any
            username,
            rolesRefs: role? [{roleId: role._id, isActive: true}]: [],
            userInfo: [],
            passwords: [
                { key: await Encryption.hashText(defautPass), isActive: true }
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

        let user = await this.cachedData.createItem<IUser>(doc)
        // callback event, after a user was created with its default password
        appEvents.emit('user-created', {
            device: null,
            ip: null,
            lt: null,
            user: null,
            module: 'admin',
            createdUser: user,
            password: defautPass
        })
        
        if (user) user = this.clearSensitiveInfo(user)
        return user
    }

    public async updateUser(id:string, username:string, disabled:boolean|string, verified:boolean|string):Promise<IUser | null> { // eslint-disable-line @typescript-eslint/no-explicit-any
        const doc:{username?:string, disabled?:boolean, verified?:boolean} = {}
        if (!id) return null
        // check username if already existing
        if (typeof username === 'string' && username.length) {
            if (await UserModel.findOne({username})) throw({code: 409}) // conflict
            doc.username = username
        }
        if (DataCleaner.getBooleanData(disabled).isValid) {
            doc.disabled = DataCleaner.getBooleanData(disabled).data
        }
        if (DataCleaner.getBooleanData(verified).isValid) {
            doc.verified = DataCleaner.getBooleanData(verified).data
        }

        // fetch the current user info
        const currUserData = await this.cachedData.getItem<IUser>(id)
        let user = await this.cachedData.updateItem<IUser>(id, doc)
        if (user) user = this.clearSensitiveInfo(user)

        // then check for the particular properties would be changed
        // callback events if there are changes on the properties
        // changes in username property
        if (user && currUserData && currUserData.username !== user.username) {
            appEvents.emit('user-changed', {
                device: null,
                ip: null,
                lt: null,
                user: null,
                property: 'username',
                value: user.username,
                previousValue: currUserData.username,
                changedUser: user,
            })
        }
        // changes in verified property
        if (user && currUserData && currUserData.disabled !== user.disabled) {
            appEvents.emit('user-changed', {
                device: null,
                ip: null,
                lt: null,
                user: null,
                property: 'disabled',
                value: user.disabled,
                previousValue: currUserData.disabled,
                changedUser: user,
            })
        }
        // changes in disabled property
        if (user && currUserData && currUserData.verified !== user.verified) {
            appEvents.emit('user-changed', {
                device: null,
                ip: null,
                lt: null,
                user: null,
                property: 'verified',
                value: user.verified,
                previousValue: currUserData.verified,
                changedUser: user,
            })
        }
        return user
    }

    public async deleteUser(id:string):Promise<IUser | null> {
        let user = await this.cachedData.deleteItem<IUser>(id)
        if (user) user = this.clearSensitiveInfo(user)
        return user
    }
}

export {
    IUserCompleteInfo
}
export default new UserController()