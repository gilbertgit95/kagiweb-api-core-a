import { Schema, model } from 'mongoose'
import { randomUUID } from 'crypto'
import TextValidators from '../validators/textValidators'

type TNotificationType = 'info' | 'warning' | 'error' | 'success'

const notificationTypes = ['info', 'warning', 'error', 'success']

// create interfaces
interface INotification {
    _id?: string,
    accountId?: string,
    title?: string,
    message?: string,
    type?: TNotificationType,
    link?: string
    seen?: boolean
}

// create schemas
const NotificationSchema = new Schema<INotification>({
    _id: { type: String, default: () => randomUUID() },
    accountId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: false,
        default: ''
    },
    message: {
        type: String,
        required: false,
        default: '',
        validate: TextValidators.validateDescription
    },
    type: {
        type: String,
        required: false,
        enum: notificationTypes,
    },
    link: {
        type: String,
        required: false,
        default: ''
    },
    seen: {
        type: Boolean,
        required: false,
        default: false
    }
}, { timestamps: true })

// create model
const NotificationModel = model<INotification>('Notification', NotificationSchema)

export {
    TNotificationType,
    INotification
}

export default NotificationModel