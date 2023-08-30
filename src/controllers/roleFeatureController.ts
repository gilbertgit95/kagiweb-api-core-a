import RoleModel, { IRole, IfeatureRef } from '../dataSource/models/roleModel'
import DataRequest, { IListOutput, IPgeInfo } from '../utilities/dataQuery'
import featureController from './featureController'
import roleController from './roleController'
// import Config from '../utilities/config'

// const env = Config.getEnv()

class RoleFeaturesController {

    public async getFeatureRef(roleId:string, featureRefId:string):Promise<IfeatureRef|null> {
        if (!(roleId && featureRefId)) throw(400)

        const allFeatures = await featureController.getAllFeatures()
        const featuresMap = !allFeatures? {}: allFeatures.reduce((acc, item) => {
            if (item && item._id) acc[item._id] = item
            return acc
        }, {})

        const role = await roleController.getRole({_id: roleId})
        if (!role) throw(404)
        const featureRef = role!.featuresRefs?.id(featureRefId)
        if (!featureRef) throw(404)

        return featuresMap[featureRef.id]
    }

    public async saveFeatureRef(roleId:string, featureId:string):Promise<IfeatureRef|null> {
        return null
    }

    public async updateFeatureRef(roleId:string, featureRefId:string, featureId:string):Promise<IfeatureRef|null> {
        return null
    }

    public async deleteFeatureRef(roleId:string, featureRefId:string):Promise<{message:string}|null> {
        if (!(roleId && featureRefId)) throw(400)

        const role = await RoleModel.findOne({_id: roleId})
        if (!role) throw(404)

        if (role!.featuresRefs?.id(featureRefId)) {
            role!.featuresRefs?.id(featureRefId)?.deleteOne()
            await role.save()
        } else {
            throw(404)
        }

        return role!.featuresRefs?.id(featureRefId)
    }
}

export default new RoleFeaturesController()