import prompts from 'prompts'

import FeatureModel from '../../dataSource/models/featureModel'
import RoleModel from '../../dataSource/models/roleModel'
import UserModel from '../../dataSource/models/userModel'

import features from '../../dataSource/seeds/featuresSeed'
import roles from '../../dataSource/seeds/rolesSeed'
import users from '../../dataSource/seeds/usersSeed'

class Seeder {
    public label = 'Seeder'
    public value = 'seeder'
    public desc = 'This will populate database with the initial data'

    public async execute():Promise<void> {
        // prompt message
        const initPrompt = await prompts({
            type: 'toggle',
            name: 'proceed',
            message: 'If the data in the seed does not exist on the databse, this will write the seeds. If the data exists, then it will be updated. Do you want to proceed?',
            initial: true,
            active: 'yes',
            inactive: 'no'
        })

        // select action to execute
        if (initPrompt.proceed) {
            // seed features
            console.log(' - seeding features')
            // await FeatureModel.insertMany(features)
            await FeatureModel.bulkWrite(features.map(item => {
                return {
                    updateOne: {
                        filter: { _id: item._id },
                        update: item,
                        upsert: true
                    }
                }
            }))

            // seed roles
            console.log(' - seeding roles')
            // await RoleModel.insertMany(roles)
            await RoleModel.bulkWrite(roles.map(item => {
                return {
                    updateOne: {
                        filter: { _id: item._id },
                        update: item,
                        upsert: true
                    }
                }
            }))

            // seed users
            console.log(' - seeding users')
            // await UserModel.insertMany(users)
            await UserModel.bulkWrite(users.map(item => {
                return {
                    updateOne: {
                        filter: { _id: item._id },
                        update: item,
                        upsert: true
                    }
                }
            }))

            console.log(' - Done')
        } else {
            console.log(' - process did not proceed, done!')
        }
    }
}

export default new Seeder()