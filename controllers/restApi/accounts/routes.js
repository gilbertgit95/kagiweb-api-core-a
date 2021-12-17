const router = require('express').Router();

const {
    getMultipleAccounts,
    createMultipleAccounts,
    updateMultipleAccounts,
    deleteMultipleAccounts
} = require('./multipleAccounts');

const {
    getAccount,
    createAccount,
    updateAccount,
    deleteAccount
} = require('./singleAccount');

router.get('/accounts', getMultipleAccounts)
router.post('/accounts', createMultipleAccounts)
router.put('/accounts', updateMultipleAccounts)
router.delete('/accounts', deleteMultipleAccounts)

router.get('/accounts/{id}', getAccount)
router.post('/accounts/new', createAccount)
router.put('/accounts/{id}', updateAccount)
router.delete('/accounts/{id}', deleteAccount)

module.exports = router