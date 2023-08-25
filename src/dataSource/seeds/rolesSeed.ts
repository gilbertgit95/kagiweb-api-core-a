// import { IRole } from '../models/roleModel'

const roles = [
    {
        '_id': '798c16ff-d75c-41b6-b9f5-69e21b08879a',
        'absoluteAuthority': true,
        'description': 'The highest role for this app, this has access to all resurces',
        'featuresRefs': [],
        'name': 'Master'
    },
    {
        '_id': 'cbe58c3c-9d86-466c-a8b4-1b26c379f276',
        'absoluteAuthority': false,
        'description': 'Have access to most of the resources.',
        'featuresRefs': [
            {
              'featureId': '3f74c3a5-3200-4c9f-a5c7-077515e1e45b',
              '_id': 'bea762cf-aceb-41ce-b6bf-410ad69ffc9d'
            },
            {
              'featureId': '03b2f7f8-119f-4a7b-a9ea-af732a90f56a',
              '_id': 'ca1f2c89-11f8-41c3-84f3-e83f1d1e9e9f'
            },
            {
              'featureId': 'c2b6d920-a101-45e5-bbdb-0f6a07da1f33',
              '_id': '370deebd-581b-44a0-894b-019c665cd650'
            },
            {
              'featureId': '1a459a99-9674-47d8-abe0-3ea8d9c60518',
              '_id': 'ea7b159f-1bdf-4222-b15d-08c1d127b25e'
            },
            {
              'featureId': 'ebc0b050-8c1b-401c-973b-072a2478e657',
              '_id': '2f27084a-5532-4de3-b8ea-b62292e9ce57'
            },
            {
              'featureId': '7ca372a6-4da5-49f2-be35-690236101c94',
              '_id': '2762e232-23ae-47ab-9419-f38d3cdec88d'
            },
            {
              'featureId': '673cabd0-1f97-465b-a9c5-24bb38635e26',
              '_id': '9dfc1fd6-d11b-4b16-8ea8-a2bc95bc375c'
            },
            {
              'featureId': 'c2604df0-6783-49fb-8405-a2a4e298ab2f',
              '_id': 'f366d962-aeba-4876-b470-e11cae1e6f78'
            },
            {
              'featureId': '82cc42a7-a67f-48f7-93c0-36f26d051e41',
              '_id': 'b1b4d9d9-8a38-4bf0-a609-04d91dd2afef'
            },
            {
              'featureId': 'b7b8040b-674e-4c56-a14d-0fdf43fdb491',
              '_id': '721e7212-3b14-494d-ac65-c680585b7c00'
            },
            {
              'featureId': '27c22d27-97ae-4fdb-99fa-1aeebde976db',
              '_id': 'ad865df5-890a-48d1-b318-e6b69185d1ac'
            },
            {
              'featureId': '3cc477be-f887-4ae5-a65d-535075413870',
              '_id': 'b38acfad-a890-4adc-a2a1-4a84ae0b3d1b'
            },
            {
              'featureId': '905dd24a-1509-482a-9db8-d8913f363c86',
              '_id': '2db929c0-15e6-4d2d-8a12-92b291a2c13b'
            },
            {
              'featureId': 'b91bac4b-c43a-4bcb-a7f3-35fbedacc77c',
              '_id': '3ed9439b-a89d-409a-a9e3-ca3443d03938'
            },
            {
              'featureId': '9c5eaa7b-a907-4970-9169-0b7dd6c32de5',
              '_id': 'caaf1808-226d-4bfe-a71a-fb1a1d2e0f85'
            },
            {
              'featureId': '6aaa75ba-27f9-450e-b3b8-72969e5718ee',
              '_id': 'bc0fdc4b-1f49-469b-ae93-1d05f4ce46a5'
            }
        ],
        'name': 'Manager'
    },
    {
        '_id': 'f2b124a8-0452-40f3-b053-c6f3b426e656',
        'absoluteAuthority': false,
        'description': 'Has limited access to resources',
        'featuresRefs': [
            {
              'featureId': '3f74c3a5-3200-4c9f-a5c7-077515e1e45b',
              '_id': 'bea762cf-aceb-41ce-b6bf-410ad69ffc9d'
            },
            {
              'featureId': '03b2f7f8-119f-4a7b-a9ea-af732a90f56a',
              '_id': 'ca1f2c89-11f8-41c3-84f3-e83f1d1e9e9f'
            },
            {
              'featureId': 'c2b6d920-a101-45e5-bbdb-0f6a07da1f33',
              '_id': '370deebd-581b-44a0-894b-019c665cd650'
            },
            {
              'featureId': '1a459a99-9674-47d8-abe0-3ea8d9c60518',
              '_id': 'ea7b159f-1bdf-4222-b15d-08c1d127b25e'
            },
            {
              'featureId': 'ebc0b050-8c1b-401c-973b-072a2478e657',
              '_id': '2f27084a-5532-4de3-b8ea-b62292e9ce57'
            },
            {
              'featureId': '7ca372a6-4da5-49f2-be35-690236101c94',
              '_id': '2762e232-23ae-47ab-9419-f38d3cdec88d'
            },
            {
              'featureId': '673cabd0-1f97-465b-a9c5-24bb38635e26',
              '_id': '9dfc1fd6-d11b-4b16-8ea8-a2bc95bc375c'
            },
            {
              'featureId': 'c2604df0-6783-49fb-8405-a2a4e298ab2f',
              '_id': 'f366d962-aeba-4876-b470-e11cae1e6f78'
            },
            {
              'featureId': '82cc42a7-a67f-48f7-93c0-36f26d051e41',
              '_id': 'b1b4d9d9-8a38-4bf0-a609-04d91dd2afef'
            },
            {
              'featureId': 'b7b8040b-674e-4c56-a14d-0fdf43fdb491',
              '_id': '721e7212-3b14-494d-ac65-c680585b7c00'
            },
            {
              'featureId': '27c22d27-97ae-4fdb-99fa-1aeebde976db',
              '_id': 'ad865df5-890a-48d1-b318-e6b69185d1ac'
            },
            {
              'featureId': '3cc477be-f887-4ae5-a65d-535075413870',
              '_id': 'b38acfad-a890-4adc-a2a1-4a84ae0b3d1b'
            },
            {
              'featureId': '905dd24a-1509-482a-9db8-d8913f363c86',
              '_id': '2db929c0-15e6-4d2d-8a12-92b291a2c13b'
            },
            {
              'featureId': 'b91bac4b-c43a-4bcb-a7f3-35fbedacc77c',
              '_id': '3ed9439b-a89d-409a-a9e3-ca3443d03938'
            },
            {
              'featureId': '9c5eaa7b-a907-4970-9169-0b7dd6c32de5',
              '_id': 'caaf1808-226d-4bfe-a71a-fb1a1d2e0f85'
            },
            {
              'featureId': '6aaa75ba-27f9-450e-b3b8-72969e5718ee',
              '_id': 'bc0fdc4b-1f49-469b-ae93-1d05f4ce46a5'
            }
        ],
        'name': 'Agent'
    },
    {
        '_id': '350f9050-6b97-497f-8c46-b6bf92ce0a4c',
        'absoluteAuthority': false,
        'description': 'Lowest access to resources',
        'featuresRefs': [],
        'name': 'Intern'
    }
]

export default roles