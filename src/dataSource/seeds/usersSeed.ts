import { IUser } from '../models/userModel'

const users:IUser[] = [
    {
        _id: '37410e75-1760-4bb6-85e0-d0a138d374bc',
        username: 'master',
        passwords: [{
            key: '$2b$10$RK2aY/N7IGG6PeCGEH03puFW8w5AWem3KftDDTyMOx5C0Mqpe9QqG',
            type: 'current'
        }],
        userInfo: [
            {
                key: 'fullname',
                value: 'Gilbert D. Cuerbo',
                type: 'string'
            }
        ],
        rolesRefs: [
            '798c16ff-d75c-41b6-b9f5-69e21b08879a',
            'cbe58c3c-9d86-466c-a8b4-1b26c379f276',
            'f2b124a8-0452-40f3-b053-c6f3b426e656'
        ],
        contactInfos: [
            {
                type: 'email-address',
                value: 'gilbert.cuerbo@gmail.com',
                countryCode: 'PH',
                disabled: false
            }
        ],
        clientDevices: [],
        limitedTransactions: [
            {
                limit: 15,
                type: 'otp-signin',
                key: 0,
                attempts: 0
            },
            {
                limit: 15,
                type: 'pass-reset',
                key: 0,
                attempts: 0
            },
            {
                limit: 15,
                type: '',
                key: 0,
                attempts: 0
            }
        ]
    }
]

export default users