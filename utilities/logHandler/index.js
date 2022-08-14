const {
    Log,
    Sequelize,
    sequelize
} = require('../../dataSource/models');

class Logger {
    constructor({account, creator, title, message}) {
        this.account = account? account: null
        this.creator = creator? creator: 'Anonymous'
        this.title = title? title: ''
        this.message = message? message: ''
    }

    setLogContent({account, creator, title, message}) {
        if (account) this.account = account
        if (creator) this.creator = creator
        if (title) this.title = title
        if (message) this.message = message

        return this
    }

    async log() {
        let log = {
            creator: this.creator,
            title: this.title,
            message: this.message
        }

        // if account existed overwrite creator
        if (this.account && this.account.username) {
            log.creator = this.account.username
        }

        await Log.create(log)

        return this
    }
}

module.exports = {
    Logger
}