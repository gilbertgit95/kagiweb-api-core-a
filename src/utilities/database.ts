import { Mongoose } from 'mongoose'

class DatabaseInfo {
    private mongoose:Mongoose
    private model:any

    setDBInfo(mongoose:Mongoose) {
        this.mongoose = mongoose
    }
}

export default new DatabaseInfo()

