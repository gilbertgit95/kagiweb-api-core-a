import prompts from 'prompts'

interface ISelectItem {
    title: string,
    description: string,
    value: string
}

interface ISelectInput {
    message: string
    choices: ISelectItem[]
}

class Input {
    public static async selectInput(input:ISelectInput):Promise<string | null> {
        const resp = await prompts({
            type: 'select',
            name: 'selected',
            message: input.message,
            choices: input.choices,
            initial: 0
        })
        let result:string|null = null

        if (resp.selected) result = resp.selected

        return result
    }
}

export {
    ISelectItem,
    ISelectInput
}
export default Input