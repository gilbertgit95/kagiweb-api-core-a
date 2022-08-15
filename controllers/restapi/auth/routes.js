const router = require('express').Router();

const multer = require('multer');
const upload = multer();

const {
    login,
    logout,
    passwordReset,
    passwordResetCodeRequest
} = require('./auth');

// upload none is use to recieve form field text data
router.post('/login', upload.none(), login)
router.post('/logout', logout)
router.post('/passwordReset', upload.none(), passwordReset)
router.post('/passwordResetCodeRequest', upload.none(), passwordResetCodeRequest)

module.exports = router