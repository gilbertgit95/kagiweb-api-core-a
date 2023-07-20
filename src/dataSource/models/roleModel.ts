import { Schema, model } from 'mongoose'
import { randomUUID } from 'crypto'

// Roles:
// - App Admin - has access to all
// - User Admin - has access to some Adminitrative features
// - Normal User - has access to some features

// create interfaces
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
    includedfeatures: IFeatureRef[]
    excludedFeatures: IFeatureRef[]
}

// create schemas
const RoleRefSchema = new Schema<IFeatureRef>({
    _id: { type: String, default: () => randomUUID() },
    featureId: { type: String, required: true }
}, { timestamps: true })

const RoleSchema = new Schema<IRole>({
    _id: { type: String, default: () => randomUUID() },
    name: { type: String, required: true, unique: true },
    level: { type: Number, required: true,  unique: true },
    description: { type: String, required: false },
    absoluteAuthority: { type: Boolean, required: false, default: false },
    includedfeatures: { type: [RoleRefSchema], required: false },
    excludedFeatures: { type: [RoleRefSchema], required: false },
}, { timestamps: true })

// create model
const RoleModel = model<IRole>('Role', RoleSchema)

export {
    IFeatureRef,
    IRole
}
export default RoleModel