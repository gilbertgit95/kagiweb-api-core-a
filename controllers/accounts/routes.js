const router = require('express').Router();

const {
    getAccounts,
    createAccounts,
    updateAccounts,
    deleteAccounts
} = require('./singleAccount');

router.get('/accounts', getAccounts)
router.post('/accounts', createAccounts)
router.put('/accounts', updateAccounts)
router.delete('/accounts', deleteAccounts)

module.exports = router