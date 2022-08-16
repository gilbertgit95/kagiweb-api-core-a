const router = require('express').Router();

const multer = require('multer');
const upload = multer();

const {
    login,
    logout,
    passwordReset,
    passwordResetCode
} = require('./auth');

// upload none is use to recieve form field text data
router.post('/login', upload.none(), login)
router.post('/logout', logout)
router.post('/passwordReset', upload.none(), passwordReset)
router.post('/passwordResetCode', upload.none(), passwordResetCode)

module.exports = router