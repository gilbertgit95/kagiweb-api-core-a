import { Schema, model } from 'mongoose'
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

interface IRole {
    _id?: string,
    name: string,
    level: number,
    description?: string,
    absoluteAuthority?: boolean,
    featuresRefs: string[]
}

// create schemas
const RoleSchema = new Schema<IRole>({
    _id: { type: String, default: () => randomUUID() },
    name: { type: String, required: true, unique: true },
    level: { type: Number, required: true,  unique: true },
    description: { type: String, required: false },
    absoluteAuthority: { type: Boolean, required: false, default: false },
    featuresRefs: { type: [String], required: false }
}, { timestamps: true })

// create model
const RoleModel = model<IRole>('Role', RoleSchema)

export {
    IRoleQuery,
    IRoleUpdate,
    IRole
}
export default RoleModel