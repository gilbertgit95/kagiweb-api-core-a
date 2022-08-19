const router = require('express').Router();

const {
    getAccount,
    updateAccountCred,
    updateAccountProfile,
    updateAccountSettings
} = require('./accountInfo');

/**
 * @swagger
 * tags:
 *      name: LoggedAccount
 *      description: Api to manage current loggedin Account
 */

/**
 * @swagger
 * /api/v1/loggedAccount:
 *      get:
 *          tags: [LoggedAccount]
 *          summary: returns list of accounts
 *          responses:
 *              200:
 *                  description: object containing list of accounts
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  data:
 *                                      type: object
 *                                      properties:
 *                                          next:
 *                                              type: string
 *                                              nullable: true
 *                                              description: url pointing to the next page
 *                                          pageSize:
 *                                              type: number
 *                                              description: number of items per page
 *                                          pageNumber:
 *                                              type: number
 *                                              description: the current page number
 *                                          totalPage:
 *                                              type: number
 *                                              description: all the availbale pages
 *                                          totalItems:
 *                                              type: number
 *                                              description: all items in all pages
 *                                          items:
 *                                              type: array
 *                                              items:
 *                                                  allOf:
 *                                                      - $ref: '#/components/schemas/Account'
 *                                                      - type: object
 *                                                        properties:
 *                                                          role:
 *                                                              $ref: '#/components/schemas/Role'
 *                                                          accountClaims:
 *                                                              type: array
 *                                                              items:
 *                                                                  $ref: '#/components/schemas/Role'
 *              500:
 *                  description: Some error occured in the server
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Error'
 */

router.get('/loggedAccount', getAccount)
router.post('/loggedAccount/credential', updateAccountCred)
router.post('/loggedAccount/profile', updateAccountProfile)
router.post('/loggedAccount/settings', updateAccountSettings)

module.exports = router