import { phone } from 'phone'

class TextValidators {

    // validate living thing names
    public static validateLivingNames = {
        validator: (value:string):boolean => {
            return /\d{3}-\d{3}-\d{4}/.test(value)
        },
        message: (props:{value:string}):string => `${props.value} is not a valid name!`
    }

    // validate object names
    public static validateObjectNames = {
        
    }

    // validate description
    public static validateDescription = {
        validator: (value:string):boolean => {
            return /\d{3}-\d{3}-\d{4}/.test(value)
        },
        message: (props:{value:string}):string => `${props.value} is not a valid description!`
    }

    // validate email
    public static validateEmail = {
        
    }

    // validate phone numbers
    public static validatePhone = {
        
    }
}

export default TextValidators