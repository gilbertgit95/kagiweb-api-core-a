import RoleModel, { IRole, IFeatureRef } from '../dataSource/models/roleModel'
import DataRequest, { IListOutput, IPgeInfo } from '../utilities/dataQuery'
import featureController from './featureController'
import roleController from './roleController'
// import Config from '../utilities/config'

// const env = Config.getEnv()

class RoleFeaturesController {
    public hasFeature(role:IRole, featureId:string):boolean {
        if (role && role.featuresRefs) {
            for (let ref of role.featuresRefs) {
                if (ref.featureId === featureId) return true
            }
        }

        return false
    }

    public async getFeatureRefByObj(role:IRole, featureId:string):Promise<IFeatureRef|null> {

        if (role && role.featuresRefs) {
            for (let ref of role.featuresRefs) {
                if (ref.featureId === featureId) return ref
            }
        }

        return null
    }

    public async getFeatureRefById(roleId:string, featureRefId:string):Promise<IFeatureRef|null> {
        if (!(roleId && featureRefId)) throw(400)

        const role = await roleController.getRole({_id: roleId})
        if (!role) throw(404)

        const featureRef = role!.featuresRefs?.id(featureRefId)
        if (!featureRef) throw(404)

        return featureRef
    }

    public async getRoleFeatureRefs(roleId:string):Promise<IFeatureRef[]> {
        if (!roleId) throw(400)

        const role = await roleController.getRole({_id: roleId})
        if (!role) throw(404)

        return role!.featuresRefs? role!.featuresRefs: []
    }

    public async saveFeatureRef(roleId:string, featureId:string):Promise<IFeatureRef|null> {
        if (!(roleId && featureId)) throw(400)

        const role = await RoleModel.findOne({_id: roleId})
        if (!role) throw(404)

        const featuresMap = await featureController.getFeaturesMap()
        // check if feature existed on features collection
        if (featuresMap[featureId]) throw(409)
        // check if the feature to update is existing on the role features refs
        if (this.hasFeature(role, featureId)) throw(409)

        role.featuresRefs!.push({featureId})
        await role.save()
        await roleController.cachedData.removeCacheData(roleId)

        return this.getFeatureRefByObj(role, featureId)
    }

    public async updateFeatureRef(roleId:string, featureRefId:string, featureId:string):Promise<IFeatureRef|null> {
        if (!(roleId && featureRefId && featureId)) throw(400)

        const role = await RoleModel.findOne({_id: roleId})
        if (!role) throw(404)
        if (!role.featuresRefs?.id(featureRefId)) throw(404)

        const featuresMap = await featureController.getFeaturesMap()
        // check if feature existed on features collection
        if (featuresMap[featureId]) throw(409)

        // check if the feature to update is existing on the role features refs
        if (!this.hasFeature(role, featureRefId)) throw(404)

        role.featuresRefs!.id(featureRefId)!.featureId = featureId
        await role.save()
        await roleController.cachedData.removeCacheData(roleId)

        return role.featuresRefs!.id(featureRefId)
    }

    public async deleteFeatureRef(roleId:string, featureRefId:string):Promise<IFeatureRef|null> {
        if (!(roleId && featureRefId)) throw(400)

        const role = await RoleModel.findOne({_id: roleId})
        if (!role) throw(404)

        if (role!.featuresRefs?.id(featureRefId)) {
            role!.featuresRefs?.id(featureRefId)?.deleteOne()
            await role.save()
            await roleController.cachedData.removeCacheData(roleId)
        } else {
            throw(404)
        }

        return role!.featuresRefs?.id(featureRefId)
    }
}

export default new RoleFeaturesController()