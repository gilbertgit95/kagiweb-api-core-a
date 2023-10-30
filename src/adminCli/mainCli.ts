#!/usr/bin/env node
import dotenv from 'dotenv'
dotenv.config()

import mongoose from '../packages/mongoose'
import prompts from 'prompts'

import Config from '../utilities/config'
import generateKeys from './processors/generateKeys'
import resetApp from './processors/resetAppData'
import seeder from './processors/seedAppData'

const env = Config.getEnv()

const logo = `
    oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo
    ooooooooooo/  /oo.*  .*ooooooooooooooooooooooooooooooooooooooooooooooooo
    oooooooooo/  /o*  .ooooooooooooooooooooooooooooooooooooooooooooooooooooo
    ooooooooo/     .*oo/    |/       |/.  _/|o/   |o/  /  ____/  __   /ooooo
    oooooooo/    *oooo/  o  |  /oo|__|/  /  |/    |/  /  |ooo/. /oo  /oooooo
    ooooooo/  .o.  *o/  _   | /oo+---+  /|  |  |  |  /|   __/  __  ooooooooo
    oooooo/  /ooo*.  *./o|  | |oo|  |  /o|  . /|  . /o|  |o/__/ooo  /ooooooo
    ooooo/__/oooooo*.__*o|__|.______|__/o|___/o|___/oo|_______/____/oooooooo
    oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo
`

interface IProcessor {
    label: string,
    value: string,
    desc: string,
    execute: () => void
}

/**
 * class that handles administrative processess
 * use this process if you want to seed new setup application
 * just be careful using this process because it can be distructive to your application
 */
class AdminCli {
    private processors:IProcessor[] = [
        generateKeys,
        resetApp,
        seeder
    ]

    private getSelectedProc(val:string):IProcessor {
        return this.processors.filter(item => item.value === val)[0]
    }

    async execute():Promise<void> {
        console.log(logo)

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

        // select action to execute
        if (initPrompt.proceed) {

            const actionToExecute = await prompts({
                type: 'select',
                name: 'action',
                message: 'Select action to execute: ',
                choices: this.processors.map(item => ({
                    title: item.label,
                    value: item.value,
                    description: item.desc
                })),
            })

            // execution
            if (actionToExecute.action) {
                const proc = this.getSelectedProc(actionToExecute.action)
                await proc.execute()
            }
        }

        // end connection to mongodb
        await mongoose.disconnect()
    }
}

(new AdminCli()).execute()