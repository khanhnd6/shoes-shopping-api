const express = require("express");
const { sendRecoverringPasswordMail } = require("../controllers/emailController");
const router = express.Router()
router.post("/send-recoverring-password-email", sendRecoverringPasswordMail)

module.exports = router;