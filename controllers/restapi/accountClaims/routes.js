const router = require('express').Router();

const {
    getMultipleAccountClaims,
    createMultipleAccountClaims,
    updateMultipleAccountClaims,
    deleteMultipleAccountClaims
} = require('./multipleAccountClaims');

const {
    getAccountClaim,
    createAccountClaim,
    updateAccountClaim,
    deleteAccountClaim
} = require('./singleAccountClaim');

/**
 * @swagger
 * tags:
 *      name: AccountClaims
 *      description: Api to manage accountClaims
 */

router.get('/accountClaims', getMultipleAccountClaims)
router.post('/accountClaims', createMultipleAccountClaims)
router.put('/accountClaims', updateMultipleAccountClaims)
router.delete('/accountClaims', deleteMultipleAccountClaims)

router.get('/accountClaims/{id}', getAccountClaim)
router.post('/accountClaims/new', createAccountClaim)
router.put('/accountClaims/{id}', updateAccountClaim)
router.delete('/accountClaims/{id}', deleteAccountClaim)

module.exports = router