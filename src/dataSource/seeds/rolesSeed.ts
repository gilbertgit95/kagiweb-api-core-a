// import { IRole } from '../models/roleModel'

const roles = [
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
        'featuresRefs': [],
        'level': 1,
        'name': 'Manager'
    },
    {
        '_id': 'f2b124a8-0452-40f3-b053-c6f3b426e656',
        'absoluteAuthority': false,
        'description': 'Has limited access to resources',
        'featuresRefs': [],
        'level': 2,
        'name': 'Agent'
    },
    {
        '_id': '350f9050-6b97-497f-8c46-b6bf92ce0a4c',
        'absoluteAuthority': false,
        'description': 'Lowest access to resources',
        'featuresRefs': [
          {
            '_id': 'f825554c-23d7-4ad3-a7ad-06adcae2cb5d',
            'featureId': '2e90dae2-32ed-4d47-8ff7-dd3c56ec4aa4'
          }
        ],
        'level': 3,
        'name': 'Intern'
    }
]

export default roles