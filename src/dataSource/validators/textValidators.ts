import { phone } from 'phone'

class TextValidators {

    // validate living thing names
    public static validateLivingName = {
        validator: (value:string):boolean => {
            return /^[a-zA-Z]+$/.test(value)
        },
        message: (props:{value:string}):string => `${props.value} is not a valid name!`
    }

    // validate flexible thing names
    public static validateFlexibleName = {
        validator: (value:string):boolean => {
            return /^[\w\s-]+$/.test(value)
        },
        message: (props:{value:string}):string => `${props.value} is not a valid name!`
    }

    // validate object names
    public static validateObjectName = {
        validator: (value:string):boolean => {
            return /^[a-zA-Z]+[0-9?a-zA-Z]+$/.test(value)
        },
        message: (props:{value:string}):string => `${props.value} is not a valid name!`
    }

    // validate description
    public static validateDescription = {
        validator: (value:string):boolean => {
            return value.length? /^[.\w\s@?$!]+$/.test(value): true
        },
        message: (props:{value:string}):string => `${props.value} is not a valid description!`
    }

    // validate email
    public static validateEmail = {
        validator: (value:string):boolean => {
            return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)
        },
        message: (props:{value:string}):string => `${props.value} is not a valid email!`
    }

    // validate phone numbers
    public static validatePhone = {
        validator: (value:string):boolean => {
            return phone(value).isValid
        },
        message: (props:{value:string}):string => `${props.value} is not a valid phone!`
    }

    // validate password
    public static validatePassword = {
        validator: (value:string):boolean => {
            return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)
        },
        message: (props:{value:string}):string => `${props.value} is not a valid password. Should have atleast a small and big letters, has number, has special character and atleast 8 characters in length.`
    }

    // validate nameId
    public static validateAccountname = {
        validator: (value:string):boolean => {
            return /^[A-Za-z0-9_]{6,29}$/.test(value)
        },
        message: (props:{value:string}):string => `${props.value} is not a valid nameId.`
    }
}

export default TextValidators