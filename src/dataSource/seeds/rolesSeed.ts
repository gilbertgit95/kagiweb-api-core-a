import { IRole } from '../models/roleModel'

const roles:IRole[] = [
    {
        '_id': '798c16ff-d75c-41b6-b9f5-69e21b08879a',
        'absoluteAuthority': true,
        'description': 'The highest role for this app, this has access to all resurces',
        'featuresRefs': [],
        'level': 0,
        'name': 'Master'
    },
    {
        '_id': 'cbe58c3c-9d86-466c-a8b4-1b26c379f276',
        'absoluteAuthority': false,
        'description': 'Have access to most of the resources.',
        'featuresRefs': [
            { featureId: '3f74c3a5-3200-4c9f-a5c7-077515e1e45b' },
            { featureId: '03b2f7f8-119f-4a7b-a9ea-af732a90f56a' },
            { featureId: 'c2b6d920-a101-45e5-bbdb-0f6a07da1f33' },
            { featureId: '1a459a99-9674-47d8-abe0-3ea8d9c60518' },
            { featureId: 'ebc0b050-8c1b-401c-973b-072a2478e657' },
            { featureId: '7ca372a6-4da5-49f2-be35-690236101c94' },
            { featureId: '673cabd0-1f97-465b-a9c5-24bb38635e26' },
            { featureId: 'c2604df0-6783-49fb-8405-a2a4e298ab2f' },
            { featureId: '82cc42a7-a67f-48f7-93c0-36f26d051e41' },
            { featureId: 'b7b8040b-674e-4c56-a14d-0fdf43fdb491' },
            { featureId: '27c22d27-97ae-4fdb-99fa-1aeebde976db' },
            { featureId: '3cc477be-f887-4ae5-a65d-535075413870' },
            { featureId: '905dd24a-1509-482a-9db8-d8913f363c86' },
            { featureId: 'b91bac4b-c43a-4bcb-a7f3-35fbedacc77c' },
            { featureId: '9c5eaa7b-a907-4970-9169-0b7dd6c32de5' },
            { featureId: '6aaa75ba-27f9-450e-b3b8-72969e5718ee' }
        ],
        'level': 1,
        'name': 'Manager'
    },
    {
        '_id': 'f2b124a8-0452-40f3-b053-c6f3b426e656',
        'absoluteAuthority': false,
        'description': 'Has limited access to resources',
        'featuresRefs': [
            { featureId: '3f74c3a5-3200-4c9f-a5c7-077515e1e45b' },
            { featureId: '03b2f7f8-119f-4a7b-a9ea-af732a90f56a' },
            { featureId: 'c2b6d920-a101-45e5-bbdb-0f6a07da1f33' },
            { featureId: '1a459a99-9674-47d8-abe0-3ea8d9c60518' },
            { featureId: 'ebc0b050-8c1b-401c-973b-072a2478e657' },
            { featureId: '7ca372a6-4da5-49f2-be35-690236101c94' },
            { featureId: '673cabd0-1f97-465b-a9c5-24bb38635e26' },
            { featureId: 'c2604df0-6783-49fb-8405-a2a4e298ab2f' },
            { featureId: '82cc42a7-a67f-48f7-93c0-36f26d051e41' },
            { featureId: 'b7b8040b-674e-4c56-a14d-0fdf43fdb491' },
            { featureId: '27c22d27-97ae-4fdb-99fa-1aeebde976db' },
            { featureId: '3cc477be-f887-4ae5-a65d-535075413870' },
            { featureId: '905dd24a-1509-482a-9db8-d8913f363c86' },
            { featureId: 'b91bac4b-c43a-4bcb-a7f3-35fbedacc77c' },
            { featureId: '9c5eaa7b-a907-4970-9169-0b7dd6c32de5' },
            { featureId: '6aaa75ba-27f9-450e-b3b8-72969e5718ee' }
        ],
        'level': 2,
        'name': 'Agent'
    }
]

export default roles