// import { IUser } from '../models/userModel'

const users = [
    {
        _id: '37410e75-1760-4bb6-85e0-d0a138d374bc',
        username: 'master',
        disabled: false,
        verified: true,
        passwords: [
            {
                _id: 'a8490a11-6d18-41b1-b0fb-f78ce73cd4b1',
                key: '$2b$10$RK2aY/N7IGG6PeCGEH03puFW8w5AWem3KftDDTyMOx5C0Mqpe9QqG',
                isActive: true
            }
        ],
        userInfos: [
            {
                _id: 'c54a858a-b095-4405-9a1c-8567ec91da5e',
                key: 'fullname',
                value: 'Gilbert D. Cuerbo',
                type: 'string'
            }
        ],
        rolesRefs: [
            {
                _id: '211654be-80bf-4ca4-9a76-0febabc872c2',
                roleId: '798c16ff-d75c-41b6-b9f5-69e21b08879a',
                isActive: true
            },
            {
                _id: '0ae3fe7a-d1f2-4eb5-9dd7-945726505b3a',
                roleId: 'cbe58c3c-9d86-466c-a8b4-1b26c379f276',
                isActive: false
            },
            {
                _id: 'bd19863e-3479-47a1-8aeb-4b0f75c03da3',
                roleId: 'f2b124a8-0452-40f3-b053-c6f3b426e656',
                isActive: false
            },
            {
                _id: 'e04f2911-2258-44fc-8fdf-83357fda03c7',
                roleId: '350f9050-6b97-497f-8c46-b6bf92ce0a4c',
                isActive: false
            }
        ],
        contactInfos: [
            {
                _id: '62986e97-cdc0-4454-897a-bd34a8071b1c',
                type: 'email-address',
                value: 'gilbert.cuerbo@gmail.com',
                countryCode: 'PH',
                verified: false
            }
        ],
        clientDevices: [],
        limitedTransactions: [
            {
                _id: '5efafc09-a05b-4acd-825d-689675298ae3',
                limit: 5,
                type: 'signin',
                key: '',
                value: '',
                attempts: 0,
                expTime: '',
                recipient: 'app-admin',
                disabled: false
            },
            {
                _id: '94e5e5f1-3314-4d79-96e3-9080efad667d',
                limit: 5,
                type: 'otp-signin',
                key: '',
                value: '',
                attempts: 0,
                expTime: '',
                recipient: 'app-admin',
                disabled: false
            },
            {
                _id: '33c18b8c-087a-4787-8fd8-350da317098e',
                limit: 5,
                type: 'forgot-pass',
                key: '',
                value: '',
                attempts: 0,
                expTime: '',
                recipient: 'app-admin',
                disabled: false
            },
            {
                _id: 'c81694f1-e54f-48a4-b3b1-a5fd4dc3ad08',
                limit: 5,
                type: 'reset-pass',
                key: '',
                value: '',
                attempts: 0,
                expTime: '',
                recipient: 'app-admin',
                disabled: false
            },
            {
                _id: '328d8474-978b-4a97-8230-418559e7449c',
                limit: 5,
                type: 'verify-contact',
                key: '',
                value: '',
                attempts: 0,
                expTime: '',
                recipient: 'app-admin',
                disabled: false
            }
        ]
    }
]

export default users