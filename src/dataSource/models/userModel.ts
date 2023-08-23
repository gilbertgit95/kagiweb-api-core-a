import { Schema, model, Document, Types } from 'mongoose'
import { randomUUID } from 'crypto'

// types
type TContactInfoType = 'email-address' | 'mobile-number' | 'telephone' | 'app-admin'
type TLimitedTransactionType = 'signin' | 'otp-signin' | 'pass-reset' | ''
type TUserInfoType = 'string' | 'number' | 'date' | 'boolean'

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
    validated?: boolean
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
    browser: {
        name: string | undefined,
        version: string | undefined,
        major: string | undefined
    },
    engine: {
        name: string | undefined,
        version: string | undefined,
    },
    os: {
        name: string | undefined,
        version: string | undefined,
    },
    device: {
        vendor: string | undefined,
        model: string | undefined,
        type: string | undefined,
    },
    cpu: {
        architecture: string | undefined,
    },
    accessTokens?: Types.DocumentArray<IAccessToken & Document>,
    disabled?: boolean
}

interface ILimitedTransaction {
    _id?: string,
    limit: number,
    type?: TLimitedTransactionType,
    key?: string,
    attempts: number,
    expTime?: string, // optional expiration time, only for timed LT
    recipient?: TContactInfoType, // optional, only for some LT like: otp, pass reset
    disabled?: boolean
}

interface IUserInfo {
    _id?: string,
    key: string,
    value: string,
    type: TUserInfoType
}

interface IUser {
    _id?: string,
    username: string,
    rolesRefs: Types.DocumentArray<IRoleRef & Document>,
    userInfo: Types.DocumentArray<IUserInfo & Document>,

    passwords: Types.DocumentArray<IPassword & Document>,

    contactInfos: Types.DocumentArray<IContactInfo & Document>,
    clientDevices: Types.DocumentArray<IClientDevice & Document>,

    limitedTransactions: Types.DocumentArray<ILimitedTransaction & Document>,

    disabled?: boolean
}

// create schemas
const RoleRef = new Schema<IRoleRef>({
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
    type: { type: String, require: true },
    value: { type: String, require: true },
    countryCode: { type: String, require: false },
    validated: { type: Boolean, require: false, default: false }
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
    browser: {
        name: { type: String, require: false, default: '' },
        version: { type: String, require: false, default: '' },
        major: { type: String, require: false, default: '' }
    },
    engine: {
        name: { type: String, require: false, default: '' },
        version: { type: String, require: false, default: '' },
    },
    os: {
        name: { type: String, require: false, default: '' },
        version: { type: String, require: false, default: '' },
    },
    device: {
        vendor: { type: String, require: false, default: '' },
        model: { type: String, require: false, default: '' },
        type: { type: String, require: false, default: '' },
    },
    cpu: {
        architecture: { type: String, require: false, default: '' },
    },
    accessTokens: { type: [AccessTokenSchema], require: false },
    disabled: { type: Boolean, require: false, default: false }
}, { timestamps: true })

const LimitedTransactionSchema = new Schema<ILimitedTransaction>({
    _id: { type: String, default: () => randomUUID()},
    limit: { type: Number, require: true },
    type: { type: String, require: false },
    key: { type: String, require: false, default: '' },
    attempts: { type: Number, require: false, default: 0 },
    expTime: { type: String, require: false, default: '' },
    recipient: { type: String, require: false, default: 'app-admin' },
    disabled: { type: Boolean, require: false, default: false }
}, { timestamps: true })

const UserInfoSchema = new Schema<IUserInfo>({
    _id: { type: String, default: () => randomUUID()},
    key: { type: String, require: true },
    value: { type: String, require: true },
    type: { type: String, require: true }
}, { timestamps: true })

const UserSchema = new Schema<IUser>({
    _id: { type: String, default: () => randomUUID()},
    username: { type: String, required: true },
    rolesRefs: { type: [RoleRef], required: true },
    userInfo: { type: [UserInfoSchema], required: false },
    passwords: { type: [PasswordSchema], required: false },
    contactInfos: { type: [ContactInfoSchema], required: false },
    clientDevices: { type: [ClientDeviceSchema], required: false },
    limitedTransactions: { type: [LimitedTransactionSchema], required: false },
    disabled: { type: Boolean, require: false, default: false }
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
    IUser
}

export default UserModel
