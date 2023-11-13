import { IFeature } from '../dataSource/models/featureModel'
import RoleModel, { IRole, IFeatureRef } from '../dataSource/models/roleModel'
import featureController from './featureController'
import roleController from './roleController'
// import Config from '../utilities/config'

// const env = Config.getEnv()

class RoleFeaturesController {
    public async getMappedFeatures(role:IRole):Promise<IFeature[]> {
        const featuresMap = await featureController.getFeaturesMap()
        let result:IFeature[] = []

        if (role && role.featuresRefs) {
            result = role.featuresRefs
                .map(item => featuresMap[item.featureId])
                .filter(item => Boolean(item))
        }

        return result
    }

    public hasFeature(role:IRole, featureId:string):boolean {
        if (role && role.featuresRefs) {
            for (const ref of role.featuresRefs) {
                if (ref.featureId === featureId) return true
            }
        }

        return false
    }

    public getFeatureRefByFeaturId(role:IRole, featureId:string):IFeatureRef|null {

        if (role && role.featuresRefs) {
            for (const ref of role.featuresRefs) {
                if (ref.featureId === featureId) return ref
            }
        }

        return null
    }

    public getFeatureRefByRefId(role:IRole, featureRefId:string):IFeatureRef|null {

        if (role && role.featuresRefs) {
            for (const ref of role.featuresRefs) {
                if (ref._id === featureRefId) return ref
            }
        }

        return null
    }

    public async getFeatureRef(roleId:string, featureRefId:string):Promise<IFeatureRef|null> {
        if (!(roleId && featureRefId)) throw({code: 400})

        const role = await roleController.getRole({_id: roleId})
        if (!role) throw({code: 404})

        const featureRef = this.getFeatureRefByRefId(role, featureRefId)
        if (!featureRef) throw({code: 404})

        return featureRef
    }

    public async getFeatureRefs(roleId:string):Promise<IFeatureRef[]> {
        let result:IFeatureRef[] = []
        if (!roleId) throw({code: 400})

        const role = await roleController.getRole({_id: roleId})
        if (!role) throw({code: 404})
        result = role!.featuresRefs? role!.featuresRefs: []
        
        if (role.absoluteAuthority) {
            const allFeatures = await featureController.getAllFeatures()
            result = allFeatures? allFeatures.map(item => ({
                featureId: item._id!
            })): []
        }

        return result
    }

    public async saveFeatureRef(roleId:string, featureId:string):Promise<IFeatureRef|null> {
        if (!(roleId && featureId)) throw({code: 400})

        const role = await RoleModel.findOne({_id: roleId})
        if (!role) throw({code: 404})

        const featuresMap = await featureController.getFeaturesMap()
        // check if feature existed on features collection
        if (!featuresMap[featureId]) throw({code: 404})
        // check if the feature to update is existing on the role features refs
        if (this.hasFeature(role, featureId)) throw({code: 409})

        role.featuresRefs!.push({featureId})
        await role.save()
        await roleController.cachedData.removeCacheData(roleId)

        return this.getFeatureRefByFeaturId(role, featureId)
    }

    public async updateFeatureRef(roleId:string, featureRefId:string, featureId:string):Promise<IFeatureRef|null> {
        if (!(roleId && featureRefId && featureId)) throw({code: 400})

        const role = await RoleModel.findOne({_id: roleId})
        if (!role) throw({code: 404})
        if (!role.featuresRefs?.id(featureRefId)) throw({code: 404})

        const featuresMap = await featureController.getFeaturesMap()
        // check if feature existed on features collection
        if (!featuresMap[featureId]) throw({code: 404})

        // check if the feature to update is existing on the role features refs
        if (this.hasFeature(role, featureId)) throw({code: 409})

        role.featuresRefs!.id(featureRefId)!.featureId = featureId
        await role.save()
        await roleController.cachedData.removeCacheData(roleId)

        return role.featuresRefs!.id(featureRefId)
    }

    public async deleteFeatureRef(roleId:string, featureRefId:string):Promise<IFeatureRef|null> {
        if (!(roleId && featureRefId)) throw({code: 400})

        const role = await RoleModel.findOne({_id: roleId})
        if (!role) throw({code: 404})

        const featureRefData = role!.featuresRefs?.id(featureRefId)
        if (featureRefData) {
            role!.featuresRefs?.id(featureRefId)?.deleteOne()
            await role.save()
            await roleController.cachedData.removeCacheData(roleId)
        } else {
            throw({code: 404})
        }

        return featureRefData? featureRefData: null
    }
}

export default new RoleFeaturesController()