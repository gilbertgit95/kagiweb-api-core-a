import { Schema, model, Document, Types } from '../../packages/mongoose'
import { randomUUID } from 'crypto'

interface IUserRef {
    _id?: string,
    userId: string,
    readAccess: boolean,
    writeAccess: boolean,
    isActive: boolean,
    disabled: boolean
}

interface IWorkspace {
    _id?: string,
    name: string,
    description?: string,
    usersRefs?: Types.DocumentArray<IUserRef & Document>,
    createdBy: string,
    modifiedBy: string
}

// create schemas
const UserRefSchema = new Schema<IUserRef>({
    _id: { type: String, default: () => randomUUID() },
    userId: { type: String, required: true},
    readAccess: { type: Boolean, default: true},
    writeAccess: { type: Boolean, default: true},
    isActive: { type: Boolean, default: true},
    disabled: { type: Boolean, default: true}
}, { timestamps: true })

const workspaceSchema = new Schema<IWorkspace>({
    _id: { type: String, default: () => randomUUID() },
    name: { type: String, required: true },
    description: { type: String, required: false },
    usersRefs: { type: [UserRefSchema], required: false, default: [] },
    modifiedBy: { type: String },
    createdBy: { type: String },
}, { timestamps: true })

// create model
const WorkspaceModel = model<IWorkspace>('Workspace', workspaceSchema)

export {
    IUserRef,
    IWorkspace
}
export default WorkspaceModel