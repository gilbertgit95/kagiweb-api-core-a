import { Mongoose } from 'mongoose'

class DatabaseInfo {
    mongoose:Mongoose

    setDBInfo(mongoose:Mongoose) {
        this.mongoose = mongoose
    }
}

export default new DatabaseInfo()

