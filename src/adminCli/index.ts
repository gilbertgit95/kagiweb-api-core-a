import mongoose from 'mongoose'
import prompts from 'prompts'

import Config from '../utilities/config'

const env = Config.getEnv()

class AdminCli {

    public static async execute():Promise<void> {
        console.log('+--------------------------+')
        console.log('|    Admin Cli started     |')
        console.log('+--------------------------+')
        console.log('\n')

        // start connection to mongodb
        await mongoose.connect(env.MongoURI? env.MongoURI: '', {
            dbName: env.DBName
        })

        // prompt message
        const initPrompt = await prompts({
            type: 'toggle',
            name: 'proceed',
            message: 'This are administrative scripts you can execute. Some of this scripts can be distructive to your application data. Would you like to proceed?',
            initial: true,
            active: 'yes',
            inactive: 'no'
        })
        console.log('\n')

        // select action to execute
        if (initPrompt.proceed) {

            const actionToExecute = await prompts(
                {
                    type: 'select',
                    name: 'action',
                    message: 'Select action to execute: ',
                    choices: [
                        { title: 'Reset Application Data', value: 'reset' },
                        { title: 'Seed Application Data', value: 'seed' },
                        { title: 'Exit', value: 'exit' }
                    ],
                }
            )

            // execution
            switch(actionToExecute.action) {
                case 'reset':
                    console.log('execute reset')
                    break
                case 'seed':
                    console.log('execute seeder')
                    break
                case 'exit':
                    console.log('exiting app')
                    break
                default:
                    console.log('')
            }
        }

        // end connection to mongodb
        await mongoose.disconnect()

        console.log('\n')
        console.log('+--------------------------+')
        console.log('|      Admin Cli ended     |')
        console.log('+--------------------------+')
        console.log('\n')
    }
}

export default AdminCli.execute()