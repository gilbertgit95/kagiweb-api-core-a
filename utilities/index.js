module.exports = {
    async wait(t) {
        let time = t? t: 1

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(true)
            }, time * 1e3)
        })
    }
}