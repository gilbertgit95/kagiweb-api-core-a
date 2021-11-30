const router = require('express').Router();

const {
    getRolesEndpoints,
    getRoleEndpoints,
    addRoleEndpoints,
    updateRoleEndpoints,
    deleteRoleEndpoints
} = require('./roleEndpoints');

/**
 * @swagger
 * components:
 *      schemas:
 *          RoleEndpoint:
 *              type: object
 *              required:
 *                  - roleId
 *                  - endpointId
 *              properties:
 *                  uuid:
 *                      type: string
 *                      description: auto generated value
 *                  roleId:
 *                      type: number
 *                      description: foriegn key to a role
 *                  endpointId:
 *                      type: number
 *                      description: foriegn key to an endpoint
 *                  createdAt:
 *                      type: string
 *                      description: date when this item was created
 *                  updatedAt:
 *                      type: string
 *                      description: date when this item was updated
 *              example:
 *                  uuid: 6ff0af1-851c-480c-ba97-69fef72316d2
 *                  createdAt: 2021-11-08T13:18:40.558Z
 *                  updatedAt: 2021-11-08T13:18:40.558Z
 *                  endpointId: 1
 *                  roleId: 1
 */

/**
 * @swagger
 * tags:
 *      name: RoleEndpoints
 *      description: API to manage the role endpoints
 */

/**
 * @swagger
 * /api/v1/roleEndpoints:
 *      get:
 *          tags: [RoleEndpoints]
 *          summary: Returns roles and its endpoints
 *          responses:
 *              200:
 *                  description: object containing a list of roles and its endpoints
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  data:
 *                                      type: array
 *                                      items:
 *                                          allOf:
 *                                              - $ref: '#/components/schemas/Role'
 *                                              - type: object
 *                                                properties:
 *                                                      endpoints:
 *                                                          type: array
 *                                                          items:
 *                                                              allOf:
 *                                                                  - $ref: '#/components/schemas/Endpoint'
 *                                                                  - type: object
 *                                                                    properties:
 *                                                                          RoleEndpoint:
 *                                                                              $ref: '#/components/schemas/RoleEndpoint'
 *                                                                  
 *              500:
 *                  description: Some error occured in the server
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Error'
 */
router.get('/roleEndpoints', getRolesEndpoints)

/**
 * @swagger
 * /api/v1/roleEndpoints/{uuid}:
 *      get:
 *          tags: [RoleEndpoints]
 *          summary: Returns role and its endpoints
 *          parameters:
 *              - in: path
 *                name: uuid
 *                schema:
 *                      type: string
 *                required: true
 *                description: uuid of role
 *          responses:
 *              200:
 *                  description: object containing a role and its endpoints
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  data:
 *                                      allOf:
 *                                          - $ref: '#/components/schemas/Role'
 *                                          - type: object
 *                                            properties:
 *                                              endpoints:
 *                                                  type: array
 *                                                  items:
 *                                                      allOf:
 *                                                          - $ref: '#/components/schemas/Endpoint'
 *                                                          - type: object
 *                                                            properties:
 *                                                              RoleEndpoint:
 *                                                                  $ref: '#/components/schemas/RoleEndpoint'
 *                                                                  
 *              500:
 *                  description: Some error occured in the server
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Error'
 *              404:
 *                  description: None existing data
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Error'
 */
router.get('/roleEndpoints/:uuid', getRoleEndpoints)

/**
 * @swagger
 * /api/v1/roleEndpoints/{uuid}:
 *      post:
 *          tags: [RoleEndpoints]
 *          summary: Returns role and its endpoints including the newly created ones
 *          parameters:
 *              - in: path
 *                name: uuid
 *                schema:
 *                      type: string
 *                required: true
 *                description: uuid of role
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              required:
 *                                  - endpointUuid
 *                              properties:
 *                                  endpointUuid:
 *                                      type: string
 *                              example:
 *                                  endpointUuid: 6ff0af1-851c-480c-ba97-69fef72316d2
 *          responses:
 *              200:
 *                  description: object containing a role and its endpoints
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  data:
 *                                      allOf:
 *                                          - $ref: '#/components/schemas/Role'
 *                                          - type: object
 *                                            properties:
 *                                              endpoints:
 *                                                  type: array
 *                                                  items:
 *                                                      oneOf:
 *                                                          - type: object
 *                                                            properties:
 *                                                              roleId:
 *                                                                  type: string
 *                                                              endpointId:
 *                                                                  type: string
 *                                                              error:
 *                                                                  type: string
 *                                                          - allOf:
 *                                                              - $ref: '#/components/schemas/Endpoint'
 *                                                              - type: object
 *                                                                properties:
 *                                                                  RoleEndpoint:
 *                                                                      $ref: '#/components/schemas/RoleEndpoint'                        
 *              500:
 *                  description: Some error occured in the server
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Error'
 *              404:
 *                  description: None existing data
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Error'
 */
router.post('/roleEndpoints/:uuid', addRoleEndpoints)

/**
 * @swagger
 * /api/v1/roleEndpoints/{uuid}:
 *      put:
 *          tags: [RoleEndpoints]
 *          summary: Returns role and its endpoints including the updated ones
 *          parameters:
 *              - in: path
 *                name: uuid
 *                schema:
 *                      type: string
 *                required: true
 *                description: uuid of role
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              required:
 *                                  - endpointUuid
 *                                  - roleEndpointUuid
 *                              properties:
 *                                  endpointUuid:
 *                                      type: string
 *                                  roleEndpointUuid:
 *                                      type: string
 *                              example:
 *                                  endpointUuid: 6ff0af1-851c-480c-ba97-69fef72316d2
 *                                  roleEndpointUuid: 6ff0af1-851c-480c-ba97-69fef72316d2
 *          responses:
 *              200:
 *                  description: object containing a role and its endpoints
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  data:
 *                                      allOf:
 *                                          - $ref: '#/components/schemas/Role'
 *                                          - type: object
 *                                            properties:
 *                                              endpoints:
 *                                                  type: array
 *                                                  items:
 *                                                      oneOf:
 *                                                          - type: object
 *                                                            properties:
 *                                                              roleId:
 *                                                                  type: string
 *                                                              endpointId:
 *                                                                  type: string
 *                                                              error:
 *                                                                  type: string
 *                                                          - allOf:
 *                                                              - $ref: '#/components/schemas/Endpoint'
 *                                                              - type: object
 *                                                                properties:
 *                                                                  RoleEndpoint:
 *                                                                      $ref: '#/components/schemas/RoleEndpoint'
 *                                                                  
 *              500:
 *                  description: Some error occured in the server
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Error'
 *              404:
 *                  description: None existing data
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Error'
 */
router.put('/roleEndpoints/:uuid', updateRoleEndpoints)

/**
 * @swagger
 * /api/v1/roleEndpoints/{uuid}:
 *      delete:
 *          tags: [RoleEndpoints]
 *          summary: Returns role and its endpoints without the deleted ones
 *          parameters:
 *              - in: path
 *                name: uuid
 *                schema:
 *                      type: string
 *                required: true
 *                description: uuid of role
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              required:
 *                                  - roleEndpointUuid
 *                              properties:
 *                                  roleEndpointUuid:
 *                                      type: string
 *                              example:
 *                                  roleEndpointUuid: 6ff0af1-851c-480c-ba97-69fef72316d2
 *          responses:
 *              200:
 *                  description: object containing a role and its endpoints
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  data:
 *                                      allOf:
 *                                          - $ref: '#/components/schemas/Role'
 *                                          - type: object
 *                                            properties:
 *                                              endpoints:
 *                                                  type: array
 *                                                  items:
 *                                                      oneOf:
 *                                                          - type: object
 *                                                            properties:
 *                                                              roleId:
 *                                                                  type: string
 *                                                              endpointId:
 *                                                                  type: string
 *                                                              error:
 *                                                                  type: string
 *                                                          - allOf:
 *                                                              - $ref: '#/components/schemas/Endpoint'
 *                                                              - type: object
 *                                                                properties:
 *                                                                  RoleEndpoint:
 *                                                                      $ref: '#/components/schemas/RoleEndpoint'
 *                                                                  
 *              500:
 *                  description: Some error occured in the server
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Error'
 *              404:
 *                  description: None existing data
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Error'
 */
router.delete('/roleEndpoints/:uuid', deleteRoleEndpoints)

module.exports = router