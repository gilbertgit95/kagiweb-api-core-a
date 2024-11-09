import { acountTypes } from '../dataSource/models/accountModel'
import roleController from '../controllers/roleController'

export const generateDefaultAccountsInfo = () => {
    return [
        { key: 'firstname', value: '', type: 'string' },
        { key: 'middlename', value: '', type: 'string' },
        { key: 'lastname', value: '', type: 'string' },
        { key: 'birthday', value: '', type: 'date' },
    ]
}

export const generateDefaultRoleRefs = async () => {
    return await roleController.getLeastRole()
}

export const generateDefaultAccountConfigs = () => {
    return [
        { key: 'default-role', value: '', type: 'string' },
        { key: 'default-workspace', value: '', type: 'string' }
    ]
}

export const generateDefaultContactInfos = () => {
    return []
}

export const generateDefaultClientDevices = () => {
    return []
}

export const generateDefaultPasswords = () => {
    return []
}

export const generateDefaultLimitedTransactions = () => {
    return []
}

export const generateDefaultWorkspaces = () => {
    return []
}

export const generateDefaultAccountData = async ():Promise<any> => {
    return { // eslint-disable-line @typescript-eslint/no-explicit-any
        nameId: null,
        accountType:         acountTypes[0],
        rolesRefs:           await generateDefaultRoleRefs(),
        accountInfos:        generateDefaultAccountsInfo(),
        accountConfigs:      generateDefaultAccountConfigs(),
        passwords:           generateDefaultPasswords(),
        contactInfos:        generateDefaultContactInfos(),
        clientDevices:       generateDefaultClientDevices(),
        limitedTransactions: generateDefaultLimitedTransactions(),
        workspaces:          generateDefaultWorkspaces()
    }
}