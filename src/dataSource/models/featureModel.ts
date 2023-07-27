import { Schema, model } from 'mongoose'
import { randomUUID } from 'crypto'

// types:
// - api-route
// - ui-route
// - ui-module
type TFeatureType = 'api-route' | 'ui-route' | 'ui-module'

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
    type: TFeatureType,
    tags?: string[],
    value: string,
    description?: string
}

// create schemas
const FeatureSchema = new Schema<IFeature>({
    _id: { type: String, default: () => randomUUID() },
    name: { type: String, required: false },
    type: { type: String, required: true },
    tags: { type: [String], required: false },
    value: { type: String, required: true },
    description: { type: String, required: false }
})

// create model
const FeatureModel = model<IFeature>('Feature', FeatureSchema)

export {
    IFeatureQuery,
    IFeatureUpdate,
    TFeatureType,
    IFeature
}

export default FeatureModel