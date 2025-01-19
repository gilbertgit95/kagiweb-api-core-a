import { IFeature } from '../dataSource/models/featureModel'
import RoleModel, { IRole, IFeatureRef } from '../dataSource/models/roleModel'
import featureController from './featureController'
import roleController from './roleController'
// import Config from '../utilities/config'

// const env = Config.getEnv()

class RoleFeaturesController {
    public async mergedRolesFeatures(appRole?:IRole, accountRole?:IRole, workspaceRole?:IRole):Promise<IFeature[]> {
        // get all features
        const featuresMap = await featureController.getFeaturesMap()
        let result:IFeature[] = []

        // merge all feature ref of the roles
        let featureRefs:Set<string> = new Set([
            ...(appRole?.featuresRefs?.map(item => item.featureId) || []),
            ...(accountRole?.featuresRefs?.map(item => item.featureId) || []),
            ...(workspaceRole?.featuresRefs?.map(item => item.featureId) || [])
        ])

        // then mnap the feature refs to actual fettures data
        if (featureRefs) {
            result = Array.from(featureRefs)
                .map(item => featuresMap[item])
                .filter(item => Boolean(item))
        }
        
        return result
    }

    public async getMappedFeatures(featureRefs:IFeatureRef[]):Promise<IFeature[]> {
        const featuresMap = await featureController.getFeaturesMap()
        let result:IFeature[] = []

        if (featureRefs) {
            result = featureRefs
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

    public async cloneFeatures(roleId:string, fromRoleId:string, overwrite:boolean = false):Promise<IFeatureRef[]|null> {
        if (!(roleId && fromRoleId)) throw({code: 400})

        let role = await RoleModel.findOne({_id: roleId})
        const fromRole =  await RoleModel.findOne({_id: fromRoleId})
        if (!role || !fromRole) throw({code: 404, message: 'this role or the role you want to clone from does not exist!'})

        // check if overwrite is true
        // then delete all role features
        if (overwrite && role.featuresRefs) {
            // role!.featuresRefs = []
            for (let item of role.featuresRefs) {
                if (item._id) await this.deleteFeatureRef(roleId, item._id)
            }
        }

        role = await RoleModel.findOne({_id: roleId})
        // create role featuresMap
        // get all fromRole features that are not in role features
        const featRefsMap = role!.featuresRefs?.reduce<{[key:string]:IFeatureRef}>((acc, item:IFeatureRef) => {
            if (item.featureId) acc[item.featureId] = item
            return acc
        }, {}) || {}
        const featToSave = fromRole.featuresRefs?.filter((item:IFeatureRef) => !featRefsMap[item.featureId]) || []

        // then push this to role features
        for (let featRef of featToSave) {
            await this.saveFeatureRef(roleId, featRef.featureId)
        }

        // save the role
        // then clear role cache
        role = await RoleModel.findOne({_id: roleId})
        await roleController.cachedData.removeCacheData(roleId)

        return role!.featuresRefs || []
    }
}

export default new RoleFeaturesController()