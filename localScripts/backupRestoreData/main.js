const { executeCommands } = require('../../utilities/cliExecutionHandler');
const prompts = require('prompts');

(async () => {
    let selection = await prompts({
        type: 'select',
        name: 'command',
        message: 'Select mongo database environment',
        choices: [
            { title: 'Backup', value: 'backup', description: 'will copy database data into the localfile' },
            { title: 'Restore', value: 'restore', description: 'will restore data from a local file to the database' },
            { title: 'Exit', value: 'exit', description: '' }
        ],
        initial: 0
    })
    // exit when nothing is selected
    if (!(selection && selection.command)) {
        console.log('Nothing is selected, process did not procced.')
        return
    }
    // exit when exit is selected
    if (selection.command === 'Exit') {
        console.log('Closing the process.')
        return
    }

    console.log('action: ', selection.command)

    // const question = await prompts({
    //     type: 'text',
    //     name: 'proceed',
    //     message:
    //         'Please be aware that if you have existing database \n' +
    //         'all your data will be lost. Type [yes] if you want \n' +
    //         'to proceed:'
    // });

    // if (question.proceed.toLowerCase() != 'yes') {
    //     console.log('- Process has been terminated')
    //     return
    // }

    // await executeCommands([
    //     'sequelize db:drop',
    //     'sequelize db:create',
    //     'sequelize db:migrate',
    //     'sequelize db:seed:all'
    // ])
})();