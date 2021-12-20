const router = require('express').Router();

const {
    login,
    logout,
    passwordReset
} = require('./auth');

router.post('/login', login)
router.post('/logout', logout)
router.post('/passwordReset', passwordReset)

module.exports = router