// import copy from 'copy-to-clipboard'
// import prompts from 'prompts'

class ResetApp {
    public label = 'Reset Application Data'
    public value = 'resetApp'
    public desc = 'This will delete all existing data then populate databse with the initial data'

    public async execute():Promise<void> {
        console.log('select options to execute')
    }
}

export default new ResetApp()