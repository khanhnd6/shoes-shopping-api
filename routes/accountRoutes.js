const express = require("express");
const router = express.Router()
const { login, adminLogin, register} = require('../controllers/accountController')
const authentication = require('../middlewares/authentication')

router.post('/login', login)

router.post('/admin-login', adminLogin)

router.post('/register', register)

module.exports = router;