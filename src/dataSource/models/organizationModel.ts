import { Schema, model, Document, Types } from '../../packages/mongoose'
import { randomUUID } from 'crypto'
import TextValidators from '../validators/textValidators'
// import NumberValidators from '../validators/numberValidators'
// import DateValidators from '../validators/dateValidators'

interface IOrganizationUserRef {
    _id?: string,
    userId: string,
    readAccess?: boolean,
    updateAccess?: boolean,
    createAccess?: boolean,
    deleteAccess?: boolean,
    declined?: boolean,
    accepted?: boolean,
    disabled?: boolean
}

interface IOrganization {
    _id?: string,
    name: string,
    description?: string,
    userRefs?: Types.DocumentArray<IOrganizationUserRef & Document>,
    isActive?: boolean,
    disabled?: boolean
}

// create schemas
const OrganizationUserRefSchema = new Schema<IOrganizationUserRef>({
    _id: { type: String, default: () => randomUUID() },
    userId: { type: String, required: true},
    readAccess: { type: Boolean, default: true},
    updateAccess: { type: Boolean, default: false},
    createAccess: { type: Boolean, default: false},
    deleteAccess: { type: Boolean, default: false},
    declined: { type: Boolean, default: false},
    accepted: { type: Boolean, default: false},
    disabled: { type: Boolean, default: false},
}, { timestamps: true })

const OrganizationSchema = new Schema<IOrganization>({
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
    userRefs: { type: [OrganizationUserRefSchema], required: false, default: [] },
    isActive: { type: Boolean, default: false},
    disabled: { type: Boolean, default: false}
}, { timestamps: true })

// create model
const  OrganizationModel = model<IOrganization>('Organization', OrganizationSchema)

export {
    IOrganizationUserRef,
    IOrganization
}

export default OrganizationModel