import { phone } from 'phone'

class TextValidators {

    // validate living thing names
    public static validateLivingNames = {
        validator: (value:string):boolean => {
            return /[a-zA-Z]+/.test(value)
        },
        message: (props:{value:string}):string => `${props.value} is not a valid name!`
    }

    // validate object names
    public static validateObjectNames = {
        validator: (value:string):boolean => {
            return /[a-zA-Z]+[0-9?a-zA-Z]+/.test(value)
        },
        message: (props:{value:string}):string => `${props.value} is not a valid name!`
    }

    // validate description
    public static validateDescription = {
        validator: (value:string):boolean => {
            return /^(.|\s)*[a-zA-Z]+(.|\s)*$/.test(value)
        },
        message: (props:{value:string}):string => `${props.value} is not a valid description!`
    }

    // validate email
    public static validateEmail = {
        validator: (value:string):boolean => {
            return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)
        },
        message: (props:{value:string}):string => `${props.value} is not a valid email!`
    }

    // validate phone numbers
    public static validatePhone = {
        
    }
}

export default TextValidators