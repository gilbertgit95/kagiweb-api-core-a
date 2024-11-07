export const generateDefaultAccountsInfo = () => {
    return [
        { key: 'firstname', value: '', type: 'string' },
        { key: 'middlename', value: '', type: 'string' },
        { key: 'lastname', value: '', type: 'string' },
        { key: 'birthday', value: '', type: 'date' },
    ]
}

export const generateDefaultRoleRefs = () => {
    return []
}

export const generateDefaultAccountConfigs = () => {
    return [
        { key: 'default-role', value: '', type: 'string' },
        { key: 'default-workspace', value: '', type: 'string' }
    ]
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

export const generateDefaultAccountData = ():any => {
    return { // eslint-disable-line @typescript-eslint/no-explicit-any
        nameId: null,
        rolesRefs: [],
        accountInfos:        generateDefaultAccountsInfo(),
        accountConfigs:      generateDefaultAccountConfigs(),
        passwords:           generateDefaultPasswords(),
        contactInfos: [],
        clientDevices: [],
        limitedTransactions: generateDefaultLimitedTransactions(),
        workspaces:          generateDefaultWorkspaces()
    }
}