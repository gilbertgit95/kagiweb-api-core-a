const router = require('express').Router();
const multer = require('multer');

const upload = multer();

const {
    login,
    logout,
    passwordReset
} = require('./auth');

// upload none is use to recieve form field data
router.post('/login', upload.none(), login)
router.post('/logout', logout)
router.post('/passwordReset', passwordReset)

module.exports = router