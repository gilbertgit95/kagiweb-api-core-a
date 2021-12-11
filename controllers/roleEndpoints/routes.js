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
 *                  id:
 *                      type: string
 *                      description: auto generated value
 *                  roleId:
 *                      type: string
 *                      description: foriegn key to a role
 *                  endpointId:
 *                      type: string
 *                      description: foriegn key to an endpoint
 *                  createdAt:
 *                      type: string
 *                      description: date when this item was created
 *                  updatedAt:
 *                      type: string
 *                      description: date when this item was updated
 *              example:
 *                  id: 6ff0af1-851c-480c-ba97-69fef72316d2
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
 * /api/v1/roleEndpoints/{id}:
 *      get:
 *          tags: [RoleEndpoints]
 *          summary: Returns role and its endpoints
 *          parameters:
 *              - in: path
 *                name: id
 *                schema:
 *                      type: string
 *                required: true
 *                description: id of role
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
router.get('/roleEndpoints/:id', getRoleEndpoints)

/**
 * @swagger
 * /api/v1/roleEndpoints/{id}:
 *      post:
 *          tags: [RoleEndpoints]
 *          summary: Returns role and its endpoints including the newly created ones
 *          parameters:
 *              - in: path
 *                name: id
 *                schema:
 *                      type: string
 *                required: true
 *                description: id of role
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              required:
 *                                  - endpointId
 *                              properties:
 *                                  endpointId:
 *                                      type: string
 *                              example:
 *                                  endpointId: 6ff0af1-851c-480c-ba97-69fef72316d2
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
router.post('/roleEndpoints/:id', addRoleEndpoints)

/**
 * @swagger
 * /api/v1/roleEndpoints/{id}:
 *      put:
 *          tags: [RoleEndpoints]
 *          summary: Returns role and its endpoints including the updated ones
 *          parameters:
 *              - in: path
 *                name: id
 *                schema:
 *                      type: string
 *                required: true
 *                description: id of role
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              required:
 *                                  - endpointId
 *                                  - roleEndpointId
 *                              properties:
 *                                  endpointId:
 *                                      type: string
 *                                  roleEndpointId:
 *                                      type: string
 *                              example:
 *                                  endpointId: 6ff0af1-851c-480c-ba97-69fef72316d2
 *                                  roleEndpointId: 6ff0af1-851c-480c-ba97-69fef72316d2
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
router.put('/roleEndpoints/:id', updateRoleEndpoints)

/**
 * @swagger
 * /api/v1/roleEndpoints/{id}:
 *      delete:
 *          tags: [RoleEndpoints]
 *          summary: Returns role and its endpoints without the deleted ones
 *          parameters:
 *              - in: path
 *                name: id
 *                schema:
 *                      type: string
 *                required: true
 *                description: id of role
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              required:
 *                                  - roleEndpointId
 *                              properties:
 *                                  roleEndpointId:
 *                                      type: string
 *                              example:
 *                                  roleEndpointId: 6ff0af1-851c-480c-ba97-69fef72316d2
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
router.delete('/roleEndpoints/:id', deleteRoleEndpoints)

module.exports = router