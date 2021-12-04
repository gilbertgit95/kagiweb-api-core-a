/**
 * contains the most common services
 * @module utilities/
 */

module.exports = {
    /**
     * pause the process for a specified time
     * @async
     * @param { number } t - time in seconds
     * @returns { Promise<boolean> } 
     */
    async wait(t) {
        let time = t? t: 1

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(true)
            }, time * 1e3)
        })
    },

    /**
     * remove all redundant data in the list
     * @param { Array<Object> } items - list of object to be checked for redundancy
     * @param { string } prop - a property tobe checked in side the object
     * @returns { Araray<Object> } list of unique object wityh respect to the property specified
     */
    removeRedundancy(items, prop) {
        let redundancy = {}
        
        return items.filter(item => {
            if (!redundancy[item[prop]]) {
                redundancy[item[prop]] = true
                return true
            } else {
                return false
            }
        })
    }
}