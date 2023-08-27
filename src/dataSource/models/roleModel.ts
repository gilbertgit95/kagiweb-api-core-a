import { Schema, model, Document, Types } from 'mongoose'
import { randomUUID } from 'crypto'

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

interface IfeatureRef {
    _id?: string,
    featureId: string
}

interface IRole {
    _id?: string,
    name: string,
    level: number,
    description?: string,
    absoluteAuthority?: boolean,
    featuresRefs?: Types.DocumentArray<IfeatureRef & Document>
}

// create schemas
const FeatureRefSchema = new Schema<IfeatureRef>({
    _id: { type: String, default: () => randomUUID() },
    featureId: { type: String, required: true}
}, { timestamps: true })

const RoleSchema = new Schema<IRole>({
    _id: { type: String, default: () => randomUUID() },
    name: { type: String, required: true, unique: true },
    level: { type: Number, required: true, unique: true },
    description: { type: String, required: false },
    absoluteAuthority: { type: Boolean, required: false, default: false },
    featuresRefs: { type: [FeatureRefSchema], required: false, default: [] }
}, { timestamps: true })

// create model
const RoleModel = model<IRole>('Role', RoleSchema)

export {
    IRoleQuery,
    IRoleUpdate,
    IfeatureRef,
    IRole
}
export default RoleModel