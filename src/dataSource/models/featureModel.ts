import { Schema, model } from '../../packages/mongoose'
import { randomUUID } from 'crypto'
import TextValidators from '../validators/textValidators'
// import NumberValidators from '../validators/numberValidators'
// import DateValidators from '../validators/dateValidators'

// types:
// - api-route
// - ui-route
// - ui-main-drawer
// - ui-account-drawer
type TFeatureType = 'api-route' | 'ui-route' | 'ui-main-drawer' | 'ui-account-drawer'
const featureTypes:TFeatureType[] = ['api-route', 'ui-route', 'ui-main-drawer', 'ui-account-drawer']

// queries
interface IFeatureQuery {
    _id?: string
}

interface IFeatureUpdate {
    name?: string
}

// create interfaces
interface IFeature {
    _id?: string,
    name?: string,
    type?: TFeatureType,
    tags?: string[],
    value: string,
    description?: string
}

// create schemas
const FeatureSchema = new Schema<IFeature>({
    _id: { type: String, default: () => randomUUID() },
    name: {
        type: String,
        required: false,
        default: ''
    },
    type: {
        type: String,
        required: true,
        enum: featureTypes,
    },
    tags: {
        type: [String],
        required: false
    },
    value: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false,
        default: '',
        validate: TextValidators.validateDescription
    }
}, { timestamps: true })

// create model
const FeatureModel = model<IFeature>('Feature', FeatureSchema)

export {
    IFeatureQuery,
    IFeatureUpdate,
    TFeatureType,
    IFeature
}

export default FeatureModel