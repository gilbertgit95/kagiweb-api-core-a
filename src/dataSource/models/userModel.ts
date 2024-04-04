import { Schema, model, Document, Types } from '../../packages/mongoose'
import { randomUUID } from 'crypto'
import TextValidators from '../validators/textValidators'
// import NumberValidators from '../validators/numberValidators'
// import DateValidators from '../validators/dateValidators'

// types
type TContactInfoType = 'email-address' | 'mobile-number' | 'telephone' | 'app-admin'
type TLimitedTransactionType = 'signin' | 'otp-signin' | 'forgot-pass'| 'reset-pass' | 'verify-contact'
type TUserInfoType = 'string' | 'number' | 'date' | 'boolean'

const contactInfoTypes = ['email-address', 'mobile-number', 'telephone', 'app-admin']
const limitedTransactionTypes = ['signin', 'otp-signin', 'forgot-pass', 'reset-pass', 'verify-contact']
const userInfoTypes = ['string', 'number', 'date', 'boolean']

// queries
interface IUserQuery {
    _id?: string,
    username?: string
}

interface IUserUpdate {
    name?: string
}

// create interfaces
interface IRoleRef {
    _id?: string,
    roleId: string,
    isActive?: boolean
}

interface IPassword {
    _id?: string,
    key: string,
    isActive?: boolean
}

interface IContactInfo {
    _id?: string,
    type: TContactInfoType,
    value: string,
    countryCode?: string,
    verified?: boolean
}

interface IAccessToken {
    _id?: string,
    jwt: string,
    ipAddress?: string,
    disabled?: boolean
}

interface IClientDevice {
    _id?: string,
    ua: string,
    accessTokens?: Types.DocumentArray<IAccessToken & Document>,
    disabled?: boolean
}

interface ILimitedTransaction {
    _id?: string,
    limit: number,
    attempts: number,
    type: TLimitedTransactionType,
    key?: string,
    value?: string, // optional, can be use to store additional info
    expTime?: string, // optional expiration time, only for timed LT
    recipient?: string, // optional, only for some LT like: otp, pass reset
    disabled?: boolean
}

interface IUserInfo {
    _id?: string,
    key: string,
    value: string,
    type: TUserInfoType
}

interface IWorkspaceUserRef {
    _id?: string,
    userId: string,
    readAccess: boolean,
    updateAccess: boolean,
    createAccess: boolean,
    deleteAccess: boolean,
    accepted: boolean,
    disabled: boolean
}

interface IWorkspace {
    _id?: string,
    name: string,
    description?: string,
    userRefs?: Types.DocumentArray<IWorkspaceUserRef & Document>,
    isActive?: boolean,
    disabled?: boolean
}

interface IUser {
    _id?: string,
    username: string,
    rolesRefs: Types.DocumentArray<IRoleRef & Document>,
    userInfos: Types.DocumentArray<IUserInfo & Document>,

    passwords: Types.DocumentArray<IPassword & Document>,

    contactInfos: Types.DocumentArray<IContactInfo & Document>,
    clientDevices: Types.DocumentArray<IClientDevice & Document>,

    limitedTransactions: Types.DocumentArray<ILimitedTransaction & Document>,

    workspaces: Types.DocumentArray<IWorkspace & Document>,

    disabled?: boolean,
    verified?: boolean
}

// create schemas
const RoleRefSchema = new Schema<IRoleRef>({
    _id: { type: String, default: () => randomUUID()},
    roleId: { type: String, require: true },
    isActive: { type: Boolean, requires: false, default: false }
}, { timestamps: true })

const PasswordSchema = new Schema<IPassword>({
    _id: { type: String, default: () => randomUUID()},
    key: { type: String, require: true },
    isActive: { type: Boolean, require: false, default: true },
}, { timestamps: true })

const ContactInfoSchema = new Schema<IContactInfo>({
    _id: { type: String, default: () => randomUUID()},
    type: {
        type: String,
        require: true,
        enum: contactInfoTypes
    },
    value: { type: String, require: true },
    countryCode: { type: String, require: false },
    verified: { type: Boolean, require: false, default: false }
}, { timestamps: true })

const AccessTokenSchema = new Schema<IAccessToken>({
    _id: { type: String, default: () => randomUUID()},
    jwt: { type: String, require: true },
    ipAddress: { type: String, require: false },
    disabled: { type: Boolean, require: false, default: false }
}, { timestamps: true })

const ClientDeviceSchema = new Schema<IClientDevice>({
    _id: { type: String, default: () => randomUUID()},
    ua: { type: String, require: true },
    accessTokens: { type: [AccessTokenSchema], require: false },
    disabled: { type: Boolean, require: false, default: false }
}, { timestamps: true })

const LimitedTransactionSchema = new Schema<ILimitedTransaction>({
    _id: { type: String, default: () => randomUUID()},
    limit: { type: Number, require: true },
    attempts: { type: Number, require: false, default: 0 },
    type: {
        type: String,
        require: false,
        enum: limitedTransactionTypes
    },
    key: { type: String, require: false, default: '' },
    value: { type: String, require: false, default: '' },
    expTime: { type: String, require: false, default: '' },
    recipient: { type: String, require: false, default: 'app-admin' },
    disabled: { type: Boolean, require: false, default: false }
}, { timestamps: true })

const UserInfoSchema = new Schema<IUserInfo>({
    _id: { type: String, default: () => randomUUID()},
    key: { type: String, require: true },
    value: { type: String, require: true },
    type: {
        type: String,
        require: true,
        enum: userInfoTypes
    }
}, { timestamps: true })

const WorkspaceUserRefSchema = new Schema<IWorkspaceUserRef>({
    _id: { type: String, default: () => randomUUID() },
    userId: { type: String, required: true},
    readAccess: { type: Boolean, default: true},
    updateAccess: { type: Boolean, default: false},
    createAccess: { type: Boolean, default: true},
    deleteAccess: { type: Boolean, default: true},
    accepted: { type: Boolean, default: true},
    disabled: { type: Boolean, default: true},
}, { timestamps: true })

const workspaceSchema = new Schema<IWorkspace>({
    _id: { type: String, default: () => randomUUID() },
    name: {
        type: String,
        required: true,
        validate: TextValidators.validateObjectName
    },
    description: {
        type: String,
        required: false,
        validate: TextValidators.validateDescription
    },
    userRefs: { type: [WorkspaceUserRefSchema], required: false, default: [] },
    isActive: { type: Boolean, default: false},
    disabled: { type: Boolean, default: false}
}, { timestamps: true })

const UserSchema = new Schema<IUser>({
    _id: { type: String, default: () => randomUUID() },
    username: {
        type: String,
        required: true,
        unique: true,
        validate: TextValidators.validateUsername
    },
    rolesRefs: { type: [RoleRefSchema], required: true, },
    userInfos: { type: [UserInfoSchema], required: false },
    passwords: { type: [PasswordSchema], required: false },
    contactInfos: { type: [ContactInfoSchema], required: false },
    clientDevices: { type: [ClientDeviceSchema], required: false },
    limitedTransactions: { type: [LimitedTransactionSchema], required: false },
    workspaces: { type: [workspaceSchema], required: false },
    disabled: { type: Boolean, require: false, default: false },
    verified: { type: Boolean, require: false, default: false }
}, { timestamps: true })

// create model
const UserModel = model<IUser>('User', UserSchema)

export {
    IUserQuery,
    IUserUpdate,
    TContactInfoType,
    TLimitedTransactionType,
    TUserInfoType,
    IPassword,
    IContactInfo,
    IAccessToken,
    IClientDevice,
    ILimitedTransaction,
    IUserInfo,
    IRoleRef,
    IWorkspaceUserRef,
    IWorkspace,
    IUser
}

export default UserModel
