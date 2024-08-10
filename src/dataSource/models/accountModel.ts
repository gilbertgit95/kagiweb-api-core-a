import { Schema, model, Document, Types } from '../../packages/mongoose'
import { randomUUID } from 'crypto'
import TextValidators from '../validators/textValidators'
// import NumberValidators from '../validators/numberValidators'
// import DateValidators from '../validators/dateValidators'

// types
type TAccountType = 'user' | 'organization'
type TContactInfoType = 'email-address' | 'mobile-number' | 'telephone' | 'app-admin'
type TLimitedTransactionType = 'signin' | 'otp-signin' | 'forgot-pass'| 'reset-pass' | 'verify-contact'
type TAccountInfoType = 'string' | 'number' | 'date' | 'boolean'

const acountTypes:TAccountType[] = ['user', 'organization']
const contactInfoTypes:TContactInfoType[] = ['email-address', 'mobile-number', 'telephone', 'app-admin']
const limitedTransactionTypes:TLimitedTransactionType[] = ['signin', 'otp-signin', 'forgot-pass', 'reset-pass', 'verify-contact']
const accountInfoTypes:TAccountInfoType[] = ['string', 'number', 'date', 'boolean']

// queries
interface IAccountQuery {
    _id?: string,
    username?: string
}

interface IAccountUpdate {
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
    expTime?: Date,
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
    description?: string,
    expTime?: Date,
    ipAddress?: string,
    disabled?: boolean
}

interface IClientDevice {
    _id?: string,
    ua: string,
    accessTokens?: Types.DocumentArray<IAccessToken & Document>,
    description?: string,
    disabled?: boolean
}

interface ILimitedTransaction {
    _id?: string,
    limit: number,
    attempts: number,
    type: TLimitedTransactionType,
    key?: string,
    value?: string, // optional, can be use to store additional info
    expTime?: Date, // optional expiration time, only for timed LT
    recipient?: string, // optional, only for some LT like: otp, pass reset
    disabled?: boolean
}

interface IAccountInfo {
    _id?: string,
    key: string,
    value: string,
    type: TAccountInfoType
}

interface IWorkspaceAccountRef {
    _id?: string,
    accountId: string,
    readAccess?: boolean,
    updateAccess?: boolean,
    createAccess?: boolean,
    deleteAccess?: boolean,
    declined?: boolean,
    accepted?: boolean,
    disabled?: boolean
}

interface IWorkspace {
    _id?: string,
    name: string,
    description?: string,
    userRefs?: Types.DocumentArray<IWorkspaceAccountRef & Document>,
    isActive?: boolean,
    disabled?: boolean
}

interface IAccount {
    _id?: string,
    accountType?: TAccountType,
    username: string,
    rolesRefs: Types.DocumentArray<IRoleRef & Document>,
    accountInfos: Types.DocumentArray<IAccountInfo & Document>,

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
    expTime: { type: Date, require: false },
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
    description: {
        type: String,
        require: false,
        validate: TextValidators.validateDescription
    },
    expTime: { type: Date, require: false },
    disabled: { type: Boolean, require: false, default: false }
}, { timestamps: true })

const ClientDeviceSchema = new Schema<IClientDevice>({
    _id: { type: String, default: () => randomUUID()},
    ua: { type: String, require: true },
    accessTokens: { type: [AccessTokenSchema], require: false },
    description: {
        type: String,
        require: false,
        validate: TextValidators.validateDescription
    },
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
    expTime: { type: Date, require: false },
    recipient: { type: String, require: false, default: 'app-admin' },
    disabled: { type: Boolean, require: false, default: false }
}, { timestamps: true })

const AccountInfoSchema = new Schema<IAccountInfo>({
    _id: { type: String, default: () => randomUUID()},
    key: { type: String, require: true },
    value: { type: String, require: true },
    type: {
        type: String,
        require: true,
        enum: accountInfoTypes
    }
}, { timestamps: true })

const WorkspaceAccountRefSchema = new Schema<IWorkspaceAccountRef>({
    _id: { type: String, default: () => randomUUID() },
    accountId: { type: String, required: true},
    readAccess: { type: Boolean, default: true},
    updateAccess: { type: Boolean, default: false},
    createAccess: { type: Boolean, default: false},
    deleteAccess: { type: Boolean, default: false},
    declined: { type: Boolean, default: false},
    accepted: { type: Boolean, default: false},
    disabled: { type: Boolean, default: false},
}, { timestamps: true })

const workspaceSchema = new Schema<IWorkspace>({
    _id: { type: String, default: () => randomUUID() },
    name: {
        type: String,
        required: true,
        validate: TextValidators.validateDescription
    },
    description: {
        type: String,
        required: false,
        validate: TextValidators.validateDescription
    },
    userRefs: { type: [WorkspaceAccountRefSchema], required: false, default: [] },
    isActive: { type: Boolean, default: false},
    disabled: { type: Boolean, default: false}
}, { timestamps: true })

const AccountSchema = new Schema<IAccount>({
    _id: { type: String, default: () => randomUUID() },
    accountType: {
        type: String,
        require: true,
        enum: acountTypes,
        required: false,
        default: acountTypes[0]
    },
    username: {
        type: String,
        required: true,
        unique: true,
        validate: TextValidators.validateUsername
    },
    rolesRefs: { type: [RoleRefSchema], required: true, },
    accountInfos: { type: [AccountInfoSchema], required: false },
    passwords: { type: [PasswordSchema], required: false },
    contactInfos: { type: [ContactInfoSchema], required: false },
    clientDevices: { type: [ClientDeviceSchema], required: false },
    limitedTransactions: { type: [LimitedTransactionSchema], required: false },
    workspaces: { type: [workspaceSchema], required: false },
    disabled: { type: Boolean, require: false, default: false },
    verified: { type: Boolean, require: false, default: false }
}, { timestamps: true })

// create model
const AccountModel = model<IAccount>('Account', AccountSchema)

export {
    acountTypes,
    contactInfoTypes,
    limitedTransactionTypes,
    accountInfoTypes,
    IAccountQuery,
    IAccountUpdate,
    TAccountType,
    TContactInfoType,
    TLimitedTransactionType,
    TAccountInfoType,
    IPassword,
    IContactInfo,
    IAccessToken,
    IClientDevice,
    ILimitedTransaction,
    IAccountInfo,
    IRoleRef,
    IWorkspaceAccountRef,
    IWorkspace,
    IAccount
}

export default AccountModel
