import DataCache from '../utilities/dataCache'
import NotificationModel, { INotification, TNotificationType } from '../dataSource/models/notificationModel'
import DataRequest, { IListOutput, IPgeInfo } from '../utilities/dataQuery'
// import Config from '../utilities/config'

// const env = Config.getEnv()

class NotificationController {
    public cachedData:DataCache
    public request:DataRequest

    constructor() {
        this.cachedData = new DataCache(NotificationModel, { stdTTL: 30, checkperiod: 15 })
        this.request = new DataRequest(NotificationModel)
    }

    public async getNotification(query:any):Promise<INotification|null> {
        if (!query._id) return null
        return await this.cachedData.getItem<INotification>(query._id)
    }

    public async getNotificationsByPage(query:{accountId?:string, seen?:boolean} = {}, pageInfo: IPgeInfo):Promise<IListOutput<INotification>> {

        const result = await this.request.getItemsByPage<INotification>(query, {}, {}, pageInfo)

        return result
    }

    public async saveNotification(accountId:string, type:TNotificationType, title:string, message:string, link?:string):Promise<INotification | null> {
        const data:INotification = {accountId, type, title, message, link, seen: false}

        const result = await this.cachedData.createItem<INotification>(data)

        return result
    }

    public async updateNotification(id:string, accountId:string, type:TNotificationType, title:string, message:string, link?:string, seen?:boolean):Promise<INotification | null> {
        const doc:INotification = {}

        if (accountId) doc.accountId = accountId
        if (type) doc.type = type
        if (title) doc.title = title
        if (message) doc.message = message
        if (link) doc.link = link
        if (seen) doc.seen = seen

        const result = await this.cachedData.updateItem<INotification>(id, doc)

        return result
    }

    public async deleteNotification(id:string):Promise<INotification | null> {

        const result = await this.cachedData.deleteItem<INotification>(id)

        return result
    }
}

export default new NotificationController()