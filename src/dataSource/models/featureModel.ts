import { Schema, model } from 'mongoose'
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
type TFeatureScope = 'account' | 'workspace'

const featureTypes:TFeatureType[] = ['api-route', 'ui-route', 'ui-main-drawer', 'ui-account-drawer']
const featureScopes:TFeatureScope[] = ['account', 'workspace']

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
    scope?: TFeatureScope,
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
    scope: {
        type: String,
        required: false,
        default: featureScopes[0],
        enum: featureScopes,
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
    IFeature,
    TFeatureType,
    TFeatureScope,

    featureTypes,
    featureScopes
}

export default FeatureModel