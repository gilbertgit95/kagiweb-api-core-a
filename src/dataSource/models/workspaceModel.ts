import { Schema, model, Document, Types } from '../../packages/mongoose'
import { randomUUID } from 'crypto'
import TextValidators from '../validators/textValidators'
import NumberValidators from '../validators/numberValidators'
import DateValidators from '../validators/dateValidators'

interface IUserRef {
    _id?: string,
    userId: string,
    readAccess: boolean,
    writeAccess: boolean
}

interface IWorkspace {
    _id?: string,
    name: string,
    description?: string,
    usersRefs?: Types.DocumentArray<IUserRef & Document>,
    isActive?: boolean,
    disabled?: boolean,
    owner: string,
    createdBy: string,
    modifiedBy: string,
}

// create schemas
const UserRefSchema = new Schema<IUserRef>({
    _id: { type: String, default: () => randomUUID() },
    userId: { type: String, required: true},
    readAccess: { type: Boolean, default: true},
    writeAccess: { type: Boolean, default: false}
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
    usersRefs: { type: [UserRefSchema], required: false, default: [] },
    isActive: { type: Boolean, default: false},
    disabled: { type: Boolean, default: false},
    owner: { type: String, required: true },
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