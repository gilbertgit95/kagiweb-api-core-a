import { Schema, model, Document, Types } from '../../packages/mongoose'
import { randomUUID } from 'crypto'
import TextValidators from '../validators/textValidators'
// import NumberValidators from '../validators/numberValidators'
// import DateValidators from '../validators/dateValidators'

// Roles:
// - App Admin - has access to all
// - User Admin - has access to some Adminitrative features
// - Normal User - has access to some features

// queries
interface IRoleQuery {
    _id?: string
}

interface IRoleUpdate {
    name?: string
}

interface IFeatureRef {
    _id?: string,
    featureId: string
}

interface IRole {
    _id?: string,
    name: string,
    level: number,
    description?: string,
    absoluteAuthority?: boolean,
    featuresRefs?: Types.DocumentArray<IFeatureRef & Document>
}

// create schemas
const FeatureRefSchema = new Schema<IFeatureRef>({
    _id: { type: String, default: () => randomUUID() },
    featureId: { type: String, required: true}
}, { timestamps: true })

const RoleSchema = new Schema<IRole>({
    _id: { type: String, default: () => randomUUID() },
    name: {
        type: String,
        required: true,
        unique: true,
        validate: TextValidators.validateObjectName
    },
    level: {
        type: Number,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: false,
        validate: TextValidators.validateDescription
    },
    absoluteAuthority: {
        type: Boolean,
        required: false,
        default: false
    },
    featuresRefs: { type: [FeatureRefSchema], required: false, default: [] }
}, { timestamps: true })

// create model
const RoleModel = model<IRole>('Role', RoleSchema)

export {
    IRoleQuery,
    IRoleUpdate,
    IFeatureRef,
    IRole
}
export default RoleModel