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

export const generateDefaultAccountData = ():any => {
    return { // eslint-disable-line @typescript-eslint/no-explicit-any
        nameId: null,
        rolesRefs: [],
        accountInfos: [
            { key: 'firstname', value: '', type: 'string' },
            { key: 'middlename', value: '', type: 'string' },
            { key: 'lastname', value: '', type: 'string' },
            { key: 'birthday', value: '', type: 'date' },
        ],
        accountConfigs: [
            { key: 'default-role', value: '', type: 'string' },
            { key: 'default-workspace', value: '', type: 'string' }
        ],
        passwords: [],
        contactInfos: [],
        clientDevices: [],
        limitedTransactions: [
            { limit: 5, type: 'signin' },
            { limit: 5, type: 'otp-signin', disabled: true },
            { limit: 5, type: 'forgot-pass' },
            { limit: 5, type: 'reset-pass' },
            { limit: 5, type: 'verify-contact'}
        ]
    }
}