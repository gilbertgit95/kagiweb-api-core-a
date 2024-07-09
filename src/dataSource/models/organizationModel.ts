import { Schema, model, Document, Types } from '../../packages/mongoose'
import { randomUUID } from 'crypto'
import TextValidators from '../validators/textValidators'
// import NumberValidators from '../validators/numberValidators'
// import DateValidators from '../validators/dateValidators'

interface IOrganizationFeature {
    _id?: string,
    name: string,
    value: string
}

interface IOrganizationFeatureRef {
    _id?: string,
    orgFeatureId: string,
}

interface IOrganizationRole {
    _id?: string,
    name: string,
    orgFeatureRefs: Types.DocumentArray<IOrganizationFeatureRef[] & Document>,
    disabled?: boolean
}

interface IOrganizationRoleRef {
    _id?: string,
    orgRoleId: string,
    isActive: boolean
}

interface IOrganizationUserRef {
    _id?: string,
    userId: string,
    orgRoleRef: Types.DocumentArray<IOrganizationRoleRef & Document>,
    declined?: boolean,
    accepted?: boolean,
    disabled?: boolean
}

interface IOrganization {
    _id?: string,
    name: string,
    description?: string,
    features?: Types.DocumentArray<IOrganizationFeature & Document>,
    roles?: Types.DocumentArray<IOrganizationRole & Document>,
    userRefs?: Types.DocumentArray<IOrganizationUserRef & Document>,
    isActive?: boolean,
    disabled?: boolean
}

// create schemas
const OrganizationUserRefSchema = new Schema<IOrganizationUserRef>({
    _id: { type: String, default: () => randomUUID() },
    userId: { type: String, required: true},
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