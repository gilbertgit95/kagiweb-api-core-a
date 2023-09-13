import { Request } from 'express'
import { IUser, IClientDevice } from '../dataSource/models/userModel'

export interface AppRequest extends Request {
    userAgentInfo: IClientDevice|null,
    userData: IUser|null
}