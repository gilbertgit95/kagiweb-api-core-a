import DataCache from '../utilities/dataCache'
import NotificationModel, { INotification, TNotificationType } from '../dataSource/models/notificationModel'
import DataRequest, { IListOutput, IPgeInfo } from '../utilities/dataQuery'
import accountController from './accountController'
// import Config from '../utilities/config'

// const env = Config.getEnv()

class NotificationController {
    public cachedData:DataCache
    public request:DataRequest

    constructor() {
        this.cachedData = new DataCache(NotificationModel, { stdTTL: 30, checkperiod: 15 })
        this.request = new DataRequest(NotificationModel)
    }

    public async getNotification(accountId:string, notifId:string):Promise<INotification|null> {
        if (!accountId || !notifId) return null
        // check that the account existed
        const account = await accountController.getAccount({_id: accountId})
        if (!account) throw({code: 404})

        // check if the ntif is really under this account
        const notif = await this.cachedData.getItem<INotification>(notifId)
        if (notif?.accountId !== account._id) throw({code: 404})

        return notif
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

    public async updateNotification(accountId:string, notifId:string, type:TNotificationType, title:string, message:string, link?:string, seen?:boolean):Promise<INotification | null> {
        const doc:INotification = {}

        if (accountId) doc.accountId = accountId
        if (type) doc.type = type
        if (title) doc.title = title
        if (message) doc.message = message
        if (link) doc.link = link
        if (seen) doc.seen = seen

        // check that the account existed
        const account = await accountController.getAccount({_id: accountId})
        if (!account) throw({code: 404})

        // check if the ntif is really under this account
        const notif = await this.cachedData.getItem<INotification>(notifId)
        if (notif?.accountId !== account._id) throw({code: 404})

        const result = await this.cachedData.updateItem<INotification>(notifId, doc)

        return result
    }

    public async deleteNotification(accountId:string, notifId:string):Promise<INotification | null> {

        if (!accountId || !notifId) return null
        // check that the account existed
        const account = await accountController.getAccount({_id: accountId})
        if (!account) throw({code: 404})

        // check if the ntif is really under this account
        const notif = await this.cachedData.getItem<INotification>(notifId)
        if (notif?.accountId !== account._id) throw({code: 404})

        const result = await this.cachedData.deleteItem<INotification>(notifId)

        return result
    }
}

export default new NotificationController()