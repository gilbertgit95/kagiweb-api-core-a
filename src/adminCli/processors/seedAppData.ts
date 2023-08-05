// import copy from 'copy-to-clipboard'
// import prompts from 'prompts'

class Seeder {
    public label = 'Seeder'
    public value = 'seeder'
    public desc = 'This will populate database with the initial data'

    public async execute():Promise<void> {
        console.log('select options to execute')
    }
}

export default new Seeder()