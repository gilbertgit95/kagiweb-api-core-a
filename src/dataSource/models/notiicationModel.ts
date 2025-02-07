import { Schema, model } from 'mongoose'
import { randomUUID } from 'crypto'
import TextValidators from '../validators/textValidators'

type TNotificationType = 'info' | 'warning' | 'error' | 'success'

const notificationTypes = ['info', 'warning', 'error', 'success']

// create interfaces
interface INotification {
    _id?: string,
    title?: string,
    type?: TNotificationType,
    description?: string,
    link?: string
}

// create schemas
const NotificationSchema = new Schema<INotification>({
    _id: { type: String, default: () => randomUUID() },
    title: {
        type: String,
        required: false,
        default: ''
    },
    type: {
        type: String,
        required: false,
        enum: notificationTypes,
    },
    description: {
        type: String,
        required: false,
        default: '',
        validate: TextValidators.validateDescription
    },
    link: {
        type: String,
        required: false,
        default: ''
    }
}, { timestamps: true })

// create model
const NotificationModel = model<INotification>('Notification', NotificationSchema)

export {
    TNotificationType,
    INotification
}

export default NotificationModel