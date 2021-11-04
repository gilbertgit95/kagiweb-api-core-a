module.exports = {
    btoa(text) {
        return Buffer.from(text).toString('base64')
    },

    atob(text) {
        return Buffer.from(text, 'base64').toString('binary')
    },

    hashText(text) {

    },

    verifyTextToHash(text, hash) {

    },

    generateJWT() {

    },

    verifyJWT(token) {

    }

}