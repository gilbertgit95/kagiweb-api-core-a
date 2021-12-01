module.exports = {
    async wait(t) {
        let time = t? t: 1

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(true)
            }, time * 1e3)
        })
    },

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