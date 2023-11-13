class DataCleaner {
    public static getBooleanData(data:boolean|string):{isValid:boolean, data:boolean} {
        const result = {isValid:false, data:false}

        if (typeof data != 'undefined') {
            if (typeof data === 'boolean') {
                result.isValid = true
                result.data = data
            }
            if (typeof data === 'string' && data.length) {
                result.isValid = true
                result.data = JSON.parse(data)
            }
        }

        return result
    }
}

export default DataCleaner