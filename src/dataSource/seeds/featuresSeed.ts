// import { IFeature } from '../models/featureModel'

const features = [
    {
        '_id': 'eadd9f55-50ff-47ef-8240-f64b4ec5e722',
        'value': 'GET - /api/v1/systemInfo',
        'description': 'One of the server endpoint',
        'name': 'GET - /api/v1/systemInfo',
        'tags': [
            'Server',
            'Api Route',
            'GET'
        ],
        'type': 'api-route'
    },
    {
        '_id': 'ab1b6851-170e-44b5-b147-d80f7b3ec76c',
        'value': 'GET - /api/v1/features',
        'description': 'One of the server endpoint',
        'name': 'GET - /api/v1/features',
        'tags': [
            'Server',
            'Api Route',
            'GET'
        ],
        'type': 'api-route'
    },
    {
        '_id': 'de2daa49-5dc2-45c6-b221-16004422c015',
        'value': 'POST - /api/v1/features',
        'description': 'One of the server endpoint',
        'name': 'POST - /api/v1/features',
        'tags': [
            'Server',
            'Api Route',
            'POST'
        ],
        'type': 'api-route'
    },
    {
        '_id': '7f1a33f7-f382-4e34-aaa0-a07663e3041c',
        'value': 'GET - /api/v1/features/:featureId',
        'description': 'One of the server endpoint',
        'name': 'GET - /api/v1/features/:featureId',
        'tags': [
            'Server',
            'Api Route',
            'GET'
        ],
        'type': 'api-route'
    },
    {
        '_id': 'ea1e2ae1-9f61-41e4-9904-a97bc6e0f119',
        'value': 'PUT - /api/v1/features/:featureId',
        'description': 'One of the server endpoint',
        'name': 'PUT - /api/v1/features/:featureId',
        'tags': [
            'Server',
            'Api Route',
            'PUT'
        ],
        'type': 'api-route'
    },
    {
        '_id': '7e6311e9-70e5-40bd-8f73-d7cf22dbb6b2',
        'value': 'DELETE - /api/v1/features/:featureId',
        'description': 'One of the server endpoint',
        'name': 'DELETE - /api/v1/features/:featureId',
        'tags': [
            'Server',
            'Api Route',
            'DELETE'
        ],
        'type': 'api-route'
    },
    {
        '_id': 'f859ca43-4e50-408e-8cd3-271de5102a9b',
        'value': 'GET - /api/v1/roles',
        'description': 'One of the server endpoint',
        'name': 'GET - /api/v1/roles',
        'tags': [
            'Server',
            'Api Route',
            'GET'
        ],
        'type': 'api-route'
    },
    {
        '_id': 'c049dde2-209f-4296-816e-2dbd54f242b0',
        'value': 'POST - /api/v1/roles',
        'description': 'One of the server endpoint',
        'name': 'POST - /api/v1/roles',
        'tags': [
            'Server',
            'Api Route',
            'POST'
        ],
        'type': 'api-route'
    },
    {
        '_id': '7f00752d-151c-464f-8aa1-0822720a02bb',
        'value': 'GET - /api/v1/roles/:roleId',
        'description': 'One of the server endpoint',
        'name': 'GET - /api/v1/roles/:roleId',
        'tags': [
            'Server',
            'Api Route',
            'GET'
        ],
        'type': 'api-route'
    },
    {
        '_id': 'd3a7c487-8918-432c-b7c8-ecdb9db3e5a7',
        'value': 'PUT - /api/v1/roles/:roleId',
        'description': 'One of the server endpoint',
        'name': 'PUT - /api/v1/roles/:roleId',
        'tags': [
            'Server',
            'Api Route',
            'PUT'
        ],
        'type': 'api-route'
    },
    {
        '_id': 'fb9b660e-73a1-4cbb-a9bc-a04ed23208bd',
        'value': 'DELETE - /api/v1/roles/:roleId',
        'description': 'One of the server endpoint',
        'name': 'DELETE - /api/v1/roles/:roleId',
        'tags': [
            'Server',
            'Api Route',
            'DELETE'
        ],
        'type': 'api-route'
    },
    {
        '_id': '38075849-0aeb-4af9-8d9b-03c1887a1a9a',
        'value': 'GET - /api/v1/roles/:roleId/features',
        'description': 'One of the server endpoint',
        'name': 'GET - /api/v1/roles/:roleId/features',
        'tags': [
            'Server',
            'Api Route',
            'GET'
        ],
        'type': 'api-route'
    },
    {
        '_id': '904e09e2-e360-4531-903f-1a853d52b68f',
        'value': 'POST - /api/v1/roles/:roleId/features',
        'description': 'One of the server endpoint',
        'name': 'POST - /api/v1/roles/:roleId/features',
        'tags': [
            'Server',
            'Api Route',
            'POST'
        ],
        'type': 'api-route'
    },
    {
        '_id': 'c62d5258-329a-416d-ae14-e152022a8999',
        'value': 'GET - /api/v1/roles/:roleId/features/:featureRefId',
        'description': 'One of the server endpoint',
        'name': 'GET - /api/v1/roles/:roleId/features/:featureRefId',
        'tags': [
            'Server',
            'Api Route',
            'GET'
        ],
        'type': 'api-route'
    },
    {
        '_id': '9cd90eec-f2e3-4954-9ead-96a9578c25ba',
        'value': 'PUT - /api/v1/roles/:roleId/features/:featureRefId',
        'description': 'One of the server endpoint',
        'name': 'PUT - /api/v1/roles/:roleId/features/:featureRefId',
        'tags': [
            'Server',
            'Api Route',
            'PUT'
        ],
        'type': 'api-route'
    },
    {
        '_id': '22675b82-afa8-4d02-b852-dda8412c7b70',
        'value': 'DELETE - /api/v1/roles/:roleId/features/:featureRefId',
        'description': 'One of the server endpoint',
        'name': 'DELETE - /api/v1/roles/:roleId/features/:featureRefId',
        'tags': [
            'Server',
            'Api Route',
            'DELETE'
        ],
        'type': 'api-route'
    },
    {
        '_id': 'f1bf5e78-c976-4344-b134-c86f580c7e0e',
        'value': 'GET - /api/v1/users',
        'description': 'One of the server endpoint',
        'name': 'GET - /api/v1/users',
        'tags': [
            'Server',
            'Api Route',
            'GET'
        ],
        'type': 'api-route'
    },
    {
        '_id': '87d76cf2-1ed8-4f46-a22f-552145420f92',
        'value': 'POST - /api/v1/users',
        'description': 'One of the server endpoint',
        'name': 'POST - /api/v1/users',
        'tags': [
            'Server',
            'Api Route',
            'POST'
        ],
        'type': 'api-route'
    },
    {
        '_id': '1608b4c7-e076-4cd4-8781-23e41a0e3d5d',
        'value': 'GET - /api/v1/users/:userId',
        'description': 'One of the server endpoint',
        'name': 'GET - /api/v1/users/:userId',
        'tags': [
            'Server',
            'Api Route',
            'GET'
        ],
        'type': 'api-route'
    },
    {
        '_id': 'c143b10b-ff38-4099-b2f3-71a69ffa6a3f',
        'value': 'PUT - /api/v1/users/:userId',
        'description': 'One of the server endpoint',
        'name': 'PUT - /api/v1/users/:userId',
        'tags': [
            'Server',
            'Api Route',
            'PUT'
        ],
        'type': 'api-route'
    },
    {
        '_id': 'e17fc847-f06f-4557-977b-14d5f9e80f5f',
        'value': 'DELETE - /api/v1/users/:userId',
        'description': 'One of the server endpoint',
        'name': 'DELETE - /api/v1/users/:userId',
        'tags': [
            'Server',
            'Api Route',
            'DELETE'
        ],
        'type': 'api-route'
    },
    {
        '_id': '7f15d512-83af-46b6-b0c0-940e2e566a4d',
        'value': 'GET - /api/v1/users/:userId/roles',
        'description': 'One of the server endpoint',
        'name': 'GET - /api/v1/users/:userId/roles',
        'tags': [
            'Server',
            'Api Route',
            'GET'
        ],
        'type': 'api-route'
    },
    {
        '_id': 'e7bf4233-d225-4496-be8b-86f8121631ca',
        'value': 'GET - /api/v1/users/:userId/roles/:roleRefId',
        'description': 'One of the server endpoint',
        'name': 'GET - /api/v1/users/:userId/roles/:roleRefId',
        'tags': [
            'Server',
            'Api Route',
            'GET'
        ],
        'type': 'api-route'
    },
    {
        '_id': 'a4e020b1-0c8f-48f2-9872-974d2e936801',
        'value': 'POST - /api/v1/users/:userId/roles',
        'description': 'One of the server endpoint',
        'name': 'POST - /api/v1/users/:userId/roles',
        'tags': [
            'Server',
            'Api Route',
            'POST'
        ],
        'type': 'api-route'
    },
    {
        '_id': 'ada2ba4a-ee69-4b15-a40f-694a0e040743',
        'value': 'PUT - /api/v1/users/:userId/roles/:roleRefId',
        'description': 'One of the server endpoint',
        'name': 'PUT - /api/v1/users/:userId/roles/:roleRefId',
        'tags': [
            'Server',
            'Api Route',
            'PUT'
        ],
        'type': 'api-route'
    },
    {
        '_id': '1a923823-9cf3-4845-8a54-0f55e9a2751a',
        'value': 'DELETE - /api/v1/users/:userId/roles/:roleRefId',
        'description': 'One of the server endpoint',
        'name': 'DELETE - /api/v1/users/:userId/roles/:roleRefId',
        'tags': [
            'Server',
            'Api Route',
            'DELETE'
        ],
        'type': 'api-route'
    },
    {
        '_id': '2652318e-cf5e-490b-8c45-bc5eb1b5b622',
        'value': 'GET - /api/v1/users/:userId/userInfos',
        'description': 'One of the server endpoint',
        'name': 'GET - /api/v1/users/:userId/userInfos',
        'tags': [
            'Server',
            'Api Route',
            'GET'
        ],
        'type': 'api-route'
    },
    {
        '_id': 'ba5e85e3-2fe5-4657-9b79-9731889cbd9a',
        'value': 'POST - /api/v1/users/:userId/userInfos',
        'description': 'One of the server endpoint',
        'name': 'POST - /api/v1/users/:userId/userInfos',
        'tags': [
            'Server',
            'Api Route',
            'POST'
        ],
        'type': 'api-route'
    },
    {
        '_id': '5a0d526a-e78b-4055-b452-b5180cc2d260',
        'value': 'GET - /api/v1/users/:userId/userInfos/:userInfoId',
        'description': 'One of the server endpoint',
        'name': 'GET - /api/v1/users/:userId/userInfos/:userInfoId',
        'tags': [
            'Server',
            'Api Route',
            'GET'
        ],
        'type': 'api-route'
    },
    {
        '_id': '4bb63448-f53f-4e08-9584-0a0cf67404ed',
        'value': 'PUT - /api/v1/users/:userId/userInfos/:userInfoId',
        'description': 'One of the server endpoint',
        'name': 'PUT - /api/v1/users/:userId/userInfos/:userInfoId',
        'tags': [
            'Server',
            'Api Route',
            'PUT'
        ],
        'type': 'api-route'
    },
    {
        '_id': '77cbbf55-128e-49ec-9d3d-5cdafd70b0cd',
        'value': 'DELETE - /api/v1/users/:userId/userInfos/:userInfoId',
        'description': 'One of the server endpoint',
        'name': 'DELETE - /api/v1/users/:userId/userInfos/:userInfoId',
        'tags': [
            'Server',
            'Api Route',
            'DELETE'
        ],
        'type': 'api-route'
    },
    {
        '_id': '34ca3a87-22c8-404d-8661-e395ca29a707',
        'value': 'GET - /api/v1/users/:userId/contactInfos',
        'description': 'One of the server endpoint',
        'name': 'GET - /api/v1/users/:userId/contactInfos',
        'tags': [
            'Server',
            'Api Route',
            'GET'
        ],
        'type': 'api-route'
    },
    {
        '_id': 'eb94f4b2-7c4e-4efe-84fc-5dbaf5de01f7',
        'value': 'POST - /api/v1/users/:userId/contactInfos',
        'description': 'One of the server endpoint',
        'name': 'POST - /api/v1/users/:userId/contactInfos',
        'tags': [
            'Server',
            'Api Route',
            'POST'
        ],
        'type': 'api-route'
    },
    {
        '_id': 'c5e7fb9f-54cf-443a-b74b-dcdbf4c4407e',
        'value': 'GET - /api/v1/users/:userId/contactInfos/:contactInfoId',
        'description': 'One of the server endpoint',
        'name': 'GET - /api/v1/users/:userId/contactInfos/:contactInfoId',
        'tags': [
            'Server',
            'Api Route',
            'GET'
        ],
        'type': 'api-route'
    },
    {
        '_id': 'a4a85703-3252-4c3e-abfe-86cb9f701505',
        'value': 'PUT - /api/v1/users/:userId/contactInfos/:contactInfoId',
        'description': 'One of the server endpoint',
        'name': 'PUT - /api/v1/users/:userId/contactInfos/:contactInfoId',
        'tags': [
            'Server',
            'Api Route',
            'PUT'
        ],
        'type': 'api-route'
    },
    {
        '_id': '5b3ce0b8-f307-48c4-a7cf-305bbff602f7',
        'value': 'DELETE - /api/v1/users/:userId/contactInfos/:contactInfoId',
        'description': 'One of the server endpoint',
        'name': 'DELETE - /api/v1/users/:userId/contactInfos/:contactInfoId',
        'tags': [
            'Server',
            'Api Route',
            'DELETE'
        ],
        'type': 'api-route'
    },
    {
        '_id': '0cad4fdf-d6e1-4aaf-8aed-711425ec69fe',
        'value': 'GET - /api/v1/users/:userId/passwords',
        'description': 'One of the server endpoint',
        'name': 'GET - /api/v1/users/:userId/passwords',
        'tags': [
            'Server',
            'Api Route',
            'GET'
        ],
        'type': 'api-route'
    },
    {
        '_id': '31f10e6d-4b4d-471c-8109-98750f1a2ee5',
        'value': 'POST - /api/v1/users/:userId/passwords',
        'description': 'One of the server endpoint',
        'name': 'POST - /api/v1/users/:userId/passwords',
        'tags': [
            'Server',
            'Api Route',
            'POST'
        ],
        'type': 'api-route'
    },
    {
        '_id': 'b7a23794-7f2f-4e59-a270-0f03be073aa2',
        'value': 'GET - /api/v1/users/:userId/passwords/:passwordId',
        'description': 'One of the server endpoint',
        'name': 'GET - /api/v1/users/:userId/passwords/:passwordId',
        'tags': [
            'Server',
            'Api Route',
            'GET'
        ],
        'type': 'api-route'
    },
    {
        '_id': '4a4194a9-5370-4c34-9160-77a533320765',
        'value': 'DELETE - /api/v1/users/:userId/passwords/:passwordId',
        'description': 'One of the server endpoint',
        'name': 'DELETE - /api/v1/users/:userId/passwords/:passwordId',
        'tags': [
            'Server',
            'Api Route',
            'DELETE'
        ],
        'type': 'api-route'
    },
    {
        '_id': '9c2eda89-436b-4380-a7d5-430f0584d9a8',
        'value': 'GET - /api/v1/users/:userId/limitedTransactions',
        'description': 'One of the server endpoint',
        'name': 'GET - /api/v1/users/:userId/limitedTransactions',
        'tags': [
            'Server',
            'Api Route',
            'GET'
        ],
        'type': 'api-route'
    },
    {
        '_id': '75e20db6-218e-4104-97fe-b7acb4631f60',
        'value': 'GET - /api/v1/users/:userId/limitedTransactions/:limitedTransactionId',
        'description': 'One of the server endpoint',
        'name': 'GET - /api/v1/users/:userId/limitedTransactions/:limitedTransactionId',
        'tags': [
            'Server',
            'Api Route',
            'GET'
        ],
        'type': 'api-route'
    },
    {
        '_id': 'ed803a0c-9e16-4adb-91f6-511c6a5f26a4',
        'value': 'PUT - /api/v1/users/:userId/limitedTransactions/:limitedTransactionId',
        'description': 'One of the server endpoint',
        'name': 'PUT - /api/v1/users/:userId/limitedTransactions/:limitedTransactionId',
        'tags': [
            'Server',
            'Api Route',
            'PUT'
        ],
        'type': 'api-route'
    },
    {
        '_id': '169bc403-f779-4338-b1d4-b78b2b992871',
        'value': 'GET - /api/v1/users/:userId/clientDevices',
        'description': 'One of the server endpoint',
        'name': 'GET - /api/v1/users/:userId/clientDevices',
        'tags': [
            'Server',
            'Api Route',
            'GET'
        ],
        'type': 'api-route'
    },
    {
        '_id': 'c1f4863d-e6f0-456e-88c3-e5a156a8adfb',
        'value': 'POST - /api/v1/users/:userId/clientDevices',
        'description': 'One of the server endpoint',
        'name': 'POST - /api/v1/users/:userId/clientDevices',
        'tags': [
            'Server',
            'Api Route',
            'POST'
        ],
        'type': 'api-route'
    },
    {
        '_id': 'ee226dff-55e8-4850-8063-9c0d45292258',
        'value': 'GET - /api/v1/users/:userId/clientDevices/:clientDeviceId',
        'description': 'One of the server endpoint',
        'name': 'GET - /api/v1/users/:userId/clientDevices/:clientDeviceId',
        'tags': [
            'Server',
            'Api Route',
            'GET'
        ],
        'type': 'api-route'
    },
    {
        '_id': '42004dde-532b-468a-a59b-fd103bf26226',
        'value': 'PUT - /api/v1/users/:userId/clientDevices/:clientDeviceId',
        'description': 'One of the server endpoint',
        'name': 'PUT - /api/v1/users/:userId/clientDevices/:clientDeviceId',
        'tags': [
            'Server',
            'Api Route',
            'PUT'
        ],
        'type': 'api-route'
    },
    {
        '_id': '561eb501-c0a0-4b79-a6da-f78d0ece9267',
        'value': 'DELETE - /api/v1/users/:userId/clientDevices/:clientDeviceId',
        'description': 'One of the server endpoint',
        'name': 'DELETE - /api/v1/users/:userId/clientDevices/:clientDeviceId',
        'tags': [
            'Server',
            'Api Route',
            'DELETE'
        ],
        'type': 'api-route'
    },
    {
        '_id': '416ede4e-15d2-4a1a-8c87-2b092403d488',
        'value': 'GET - /api/v1/users/:userId/clientDevices/:clientDeviceId/accessTokens',
        'description': 'One of the server endpoint',
        'name': 'GET - /api/v1/users/:userId/clientDevices/:clientDeviceId/accessTokens',
        'tags': [
            'Server',
            'Api Route',
            'GET'
        ],
        'type': 'api-route'
    },
    {
        '_id': '906787c7-abf9-4ced-8f43-a1cbff501178',
        'value': 'POST - /api/v1/users/:userId/clientDevices/:clientDeviceId/accessTokens',
        'description': 'One of the server endpoint',
        'name': 'POST - /api/v1/users/:userId/clientDevices/:clientDeviceId/accessTokens',
        'tags': [
            'Server',
            'Api Route',
            'POST'
        ],
        'type': 'api-route'
    },
    {
        '_id': '21d540c3-9309-44c8-b144-500f3922c0e8',
        'value': 'GET - /api/v1/users/:userId/clientDevices/:clientDeviceId/accessTokens/:accessTokenId',
        'description': 'One of the server endpoint',
        'name': 'GET - /api/v1/users/:userId/clientDevices/:clientDeviceId/accessTokens/:accessTokenId',
        'tags': [
            'Server',
            'Api Route',
            'GET'
        ],
        'type': 'api-route'
    },
    {
        '_id': 'b03607ad-982f-4cd1-9c14-c51a984c2e1e',
        'value': 'PUT - /api/v1/users/:userId/clientDevices/:clientDeviceId/accessTokens/:accessTokenId',
        'description': 'One of the server endpoint',
        'name': 'PUT - /api/v1/users/:userId/clientDevices/:clientDeviceId/accessTokens/:accessTokenId',
        'tags': [
            'Server',
            'Api Route',
            'PUT'
        ],
        'type': 'api-route'
    },
    {
        '_id': 'b57a0c39-e31f-4f27-b46e-e715c6d41a02',
        'value': 'DELETE - /api/v1/users/:userId/clientDevices/:clientDeviceId/accessTokens/:accessTokenId',
        'description': 'One of the server endpoint',
        'name': 'DELETE - /api/v1/users/:userId/clientDevices/:clientDeviceId/accessTokens/:accessTokenId',
        'tags': [
            'Server',
            'Api Route',
            'DELETE'
        ],
        'type': 'api-route'
    },
    {
        '_id': '2e90dae2-32ed-4d47-8ff7-dd3c56ec4aa4',
        'value': 'GET - /api/v1/owner',
        'description': 'One of the server endpoint',
        'name': 'GET - /api/v1/owner',
        'tags': [
            'Server',
            'Api Route',
            'GET'
        ],
        'type': 'api-route'
    },
    {
        '_id': '886f4ba8-ed70-4e79-9638-838a7c45108a',
        'value': 'PUT - /api/v1/owner',
        'description': 'One of the server endpoint',
        'name': 'PUT - /api/v1/owner',
        'tags': [
            'Server',
            'Api Route',
            'PUT'
        ],
        'type': 'api-route'
    },
    {
        '_id': 'd48d57d8-0bf3-4b73-b521-f30923937289',
        'value': 'GET - /api/v1/owner/roles',
        'description': 'One of the server endpoint',
        'name': 'GET - /api/v1/owner/roles',
        'tags': [
            'Server',
            'Api Route',
            'GET'
        ],
        'type': 'api-route'
    },
    {
        '_id': '98d77b97-fbd3-4d2d-84a5-93967d6589a0',
        'value': 'GET - /api/v1/owner/roles/:roleRefId',
        'description': 'One of the server endpoint',
        'name': 'GET - /api/v1/owner/roles/:roleRefId',
        'tags': [
            'Server',
            'Api Route',
            'GET'
        ],
        'type': 'api-route'
    },
    {
        '_id': 'f3a132d5-0bfe-4da6-95ed-f9a811c11b55',
        'value': 'POST - /api/v1/owner/roles',
        'description': 'One of the server endpoint',
        'name': 'POST - /api/v1/owner/roles',
        'tags': [
            'Server',
            'Api Route',
            'POST'
        ],
        'type': 'api-route'
    },
    {
        '_id': 'c03a81af-3763-4b4d-8147-be5bc369cad1',
        'value': 'PUT - /api/v1/owner/roles/:roleRefId',
        'description': 'One of the server endpoint',
        'name': 'PUT - /api/v1/owner/roles/:roleRefId',
        'tags': [
            'Server',
            'Api Route',
            'PUT'
        ],
        'type': 'api-route'
    },
    {
        '_id': '58471c04-be21-4508-bccf-2723364c4d3c',
        'value': 'DELETE - /api/v1/owner/roles/:roleRefId',
        'description': 'One of the server endpoint',
        'name': 'DELETE - /api/v1/owner/roles/:roleRefId',
        'tags': [
            'Server',
            'Api Route',
            'DELETE'
        ],
        'type': 'api-route'
    },
    {
        '_id': 'd06f83f4-35a4-4ddc-8f84-f4e8d90e2a8d',
        'value': 'GET - /api/v1/owner/userInfos',
        'description': 'One of the server endpoint',
        'name': 'GET - /api/v1/owner/userInfos',
        'tags': [
            'Server',
            'Api Route',
            'GET'
        ],
        'type': 'api-route'
    },
    {
        '_id': 'de03656f-1522-48b5-beff-8ff90874c1b2',
        'value': 'POST - /api/v1/owner/userInfos',
        'description': 'One of the server endpoint',
        'name': 'POST - /api/v1/owner/userInfos',
        'tags': [
            'Server',
            'Api Route',
            'POST'
        ],
        'type': 'api-route'
    },
    {
        '_id': 'e59d3de7-39cd-46d2-b780-389e6c763944',
        'value': 'GET - /api/v1/owner/userInfos/:userInfoId',
        'description': 'One of the server endpoint',
        'name': 'GET - /api/v1/owner/userInfos/:userInfoId',
        'tags': [
            'Server',
            'Api Route',
            'GET'
        ],
        'type': 'api-route'
    },
    {
        '_id': 'e5c60129-9267-4ccb-a79b-97d941e1fc98',
        'value': 'PUT - /api/v1/owner/userInfos/:userInfoId',
        'description': 'One of the server endpoint',
        'name': 'PUT - /api/v1/owner/userInfos/:userInfoId',
        'tags': [
            'Server',
            'Api Route',
            'PUT'
        ],
        'type': 'api-route'
    },
    {
        '_id': '6cb961f3-1ea3-4f6b-b930-8b088a15be95',
        'value': 'DELETE - /api/v1/owner/userInfos/:userInfoId',
        'description': 'One of the server endpoint',
        'name': 'DELETE - /api/v1/owner/userInfos/:userInfoId',
        'tags': [
            'Server',
            'Api Route',
            'DELETE'
        ],
        'type': 'api-route'
    },
    {
        '_id': 'daf025ef-e54e-4fdc-a832-8888928f9a15',
        'value': 'GET - /api/v1/owner/contactInfos',
        'description': 'One of the server endpoint',
        'name': 'GET - /api/v1/owner/contactInfos',
        'tags': [
            'Server',
            'Api Route',
            'GET'
        ],
        'type': 'api-route'
    },
    {
        '_id': '12cfb96b-d6fc-41fb-9457-a562deb3c20f',
        'value': 'POST - /api/v1/owner/contactInfos',
        'description': 'One of the server endpoint',
        'name': 'POST - /api/v1/owner/contactInfos',
        'tags': [
            'Server',
            'Api Route',
            'POST'
        ],
        'type': 'api-route'
    },
    {
        '_id': 'cf9234a0-2ed1-4e25-b325-0e8b7e818f5b',
        'value': 'GET - /api/v1/owner/contactInfos/:contactInfoId',
        'description': 'One of the server endpoint',
        'name': 'GET - /api/v1/owner/contactInfos/:contactInfoId',
        'tags': [
            'Server',
            'Api Route',
            'GET'
        ],
        'type': 'api-route'
    },
    {
        '_id': 'a809f32e-4ef6-4480-9ace-b8585630cde5',
        'value': 'PUT - /api/v1/owner/contactInfos/:contactInfoId',
        'description': 'One of the server endpoint',
        'name': 'PUT - /api/v1/owner/contactInfos/:contactInfoId',
        'tags': [
            'Server',
            'Api Route',
            'PUT'
        ],
        'type': 'api-route'
    },
    {
        '_id': '2ad2fc91-d555-4a39-97fb-31dfd338b8de',
        'value': 'DELETE - /api/v1/owner/contactInfos/:contactInfoId',
        'description': 'One of the server endpoint',
        'name': 'DELETE - /api/v1/owner/contactInfos/:contactInfoId',
        'tags': [
            'Server',
            'Api Route',
            'DELETE'
        ],
        'type': 'api-route'
    },
    {
        '_id': '2d3e49bf-4a49-4c79-a391-53222ae55252',
        'value': 'GET - /api/v1/owner/passwords',
        'description': 'One of the server endpoint',
        'name': 'GET - /api/v1/owner/passwords',
        'tags': [
            'Server',
            'Api Route',
            'GET'
        ],
        'type': 'api-route'
    },
    {
        '_id': 'c8007276-3f8e-4962-a0c2-d8f0c9b5eb98',
        'value': 'POST - /api/v1/owner/passwords',
        'description': 'One of the server endpoint',
        'name': 'POST - /api/v1/owner/passwords',
        'tags': [
            'Server',
            'Api Route',
            'POST'
        ],
        'type': 'api-route'
    },
    {
        '_id': 'f6e45daf-6694-4766-a81f-04c6c2375b8d',
        'value': 'GET - /api/v1/owner/passwords/:passwordId',
        'description': 'One of the server endpoint',
        'name': 'GET - /api/v1/owner/passwords/:passwordId',
        'tags': [
            'Server',
            'Api Route',
            'GET'
        ],
        'type': 'api-route'
    },
    {
        '_id': '1b3167cf-8639-4cc0-95b4-4cfe490619c5',
        'value': 'DELETE - /api/v1/owner/passwords/:passwordId',
        'description': 'One of the server endpoint',
        'name': 'DELETE - /api/v1/owner/passwords/:passwordId',
        'tags': [
            'Server',
            'Api Route',
            'DELETE'
        ],
        'type': 'api-route'
    },
    {
        '_id': 'a406c62e-36c1-46b2-9ef3-f04c2e04d8ca',
        'value': 'GET - /api/v1/owner/limitedTransactions',
        'description': 'One of the server endpoint',
        'name': 'GET - /api/v1/owner/limitedTransactions',
        'tags': [
            'Server',
            'Api Route',
            'GET'
        ],
        'type': 'api-route'
    },
    {
        '_id': '11826468-7e6b-4e37-ba51-9d7d4e2d817f',
        'value': 'GET - /api/v1/owner/limitedTransactions/:limitedTransactionId',
        'description': 'One of the server endpoint',
        'name': 'GET - /api/v1/owner/limitedTransactions/:limitedTransactionId',
        'tags': [
            'Server',
            'Api Route',
            'GET'
        ],
        'type': 'api-route'
    },
    {
        '_id': 'abd5b2af-f44a-447e-bc9e-039e773e02bf',
        'value': 'PUT - /api/v1/owner/limitedTransactions/:limitedTransactionId',
        'description': 'One of the server endpoint',
        'name': 'PUT - /api/v1/owner/limitedTransactions/:limitedTransactionId',
        'tags': [
            'Server',
            'Api Route',
            'PUT'
        ],
        'type': 'api-route'
    },
    {
        '_id': 'ee90cf0b-4448-4e11-a264-6c1f4f77516a',
        'value': 'GET - /api/v1/owner/clientDevices',
        'description': 'One of the server endpoint',
        'name': 'GET - /api/v1/owner/clientDevices',
        'tags': [
            'Server',
            'Api Route',
            'GET'
        ],
        'type': 'api-route'
    },
    {
        '_id': '33c9db06-855d-4d47-8929-ff5b74191ee1',
        'value': 'POST - /api/v1/owner/clientDevices',
        'description': 'One of the server endpoint',
        'name': 'POST - /api/v1/owner/clientDevices',
        'tags': [
            'Server',
            'Api Route',
            'POST'
        ],
        'type': 'api-route'
    },
    {
        '_id': '3599016e-c36a-439f-908c-670525eb8e26',
        'value': 'GET - /api/v1/owner/clientDevices/:clientDeviceId',
        'description': 'One of the server endpoint',
        'name': 'GET - /api/v1/owner/clientDevices/:clientDeviceId',
        'tags': [
            'Server',
            'Api Route',
            'GET'
        ],
        'type': 'api-route'
    },
    {
        '_id': '172ea74c-dde3-45e0-a947-2760a486f52c',
        'value': 'PUT - /api/v1/owner/clientDevices/:clientDeviceId',
        'description': 'One of the server endpoint',
        'name': 'PUT - /api/v1/owner/clientDevices/:clientDeviceId',
        'tags': [
            'Server',
            'Api Route',
            'PUT'
        ],
        'type': 'api-route'
    },
    {
        '_id': 'c5481c32-deaf-4efa-8ff1-bd60c664e690',
        'value': 'DELETE - /api/v1/owner/clientDevices/:clientDeviceId',
        'description': 'One of the server endpoint',
        'name': 'DELETE - /api/v1/owner/clientDevices/:clientDeviceId',
        'tags': [
            'Server',
            'Api Route',
            'DELETE'
        ],
        'type': 'api-route'
    },
    {
        '_id': '6935aabb-e7dc-496c-94c8-92478cfa3072',
        'value': 'GET - /api/v1/owner/clientDevices/:clientDeviceId/accessTokens',
        'description': 'One of the server endpoint',
        'name': 'GET - /api/v1/owner/clientDevices/:clientDeviceId/accessTokens',
        'tags': [
            'Server',
            'Api Route',
            'GET'
        ],
        'type': 'api-route'
    },
    {
        '_id': 'c8a1fd70-87e2-412c-87d0-57677f775b83',
        'value': 'POST - /api/v1/owner/clientDevices/:clientDeviceId/accessTokens',
        'description': 'One of the server endpoint',
        'name': 'POST - /api/v1/owner/clientDevices/:clientDeviceId/accessTokens',
        'tags': [
            'Server',
            'Api Route',
            'POST'
        ],
        'type': 'api-route'
    },
    {
        '_id': 'b0514442-38ba-433f-8381-2752129a0989',
        'value': 'GET - /api/v1/owner/clientDevices/:clientDeviceId/accessTokens/:accessTokenId',
        'description': 'One of the server endpoint',
        'name': 'GET - /api/v1/owner/clientDevices/:clientDeviceId/accessTokens/:accessTokenId',
        'tags': [
            'Server',
            'Api Route',
            'GET'
        ],
        'type': 'api-route'
    },
    {
        '_id': '6c37f2c5-035a-43eb-8c49-17e09d714cc0',
        'value': 'PUT - /api/v1/owner/clientDevices/:clientDeviceId/accessTokens/:accessTokenId',
        'description': 'One of the server endpoint',
        'name': 'PUT - /api/v1/owner/clientDevices/:clientDeviceId/accessTokens/:accessTokenId',
        'tags': [
            'Server',
            'Api Route',
            'PUT'
        ],
        'type': 'api-route'
    },
    {
        '_id': '958faaa1-26f6-43ef-848e-1f5136416366',
        'value': 'DELETE - /api/v1/owner/clientDevices/:clientDeviceId/accessTokens/:accessTokenId',
        'description': 'One of the server endpoint',
        'name': 'DELETE - /api/v1/owner/clientDevices/:clientDeviceId/accessTokens/:accessTokenId',
        'tags': [
            'Server',
            'Api Route',
            'DELETE'
        ],
        'type': 'api-route'
    }
]

export default features