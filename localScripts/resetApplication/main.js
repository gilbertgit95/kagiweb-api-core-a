const { executeCommands } = require('../../utilities/cliExecutionHandler');
const prompts = require('prompts');

(async () => {
    const question = await prompts({
        type: 'text',
        name: 'proceed',
        message:
            'Please be aware that if you have existing database \n' +
            'all your data will be lost. Type [yes] if you still \n' +
            'want to proceed:'
    });

    if (question.proceed.toLowerCase() != 'yes') {
        console.log('- Process has been terminated')
        return
    }

    await executeCommands([
        'sequelize db:drop',
        'sequelize db:create',
        'sequelize db:migrate',
        'sequelize db:seed:all'
    ])
})();