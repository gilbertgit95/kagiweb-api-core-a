import UserModel, { IUser } from '../../src/dataSource/models/userModel'

async function getUser(id: string):Promise<IUser|null> {
    const user = await UserModel.findOne({_id: id})
    return user
}

export {
    getUser
}