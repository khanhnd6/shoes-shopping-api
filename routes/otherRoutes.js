const express = require("express");
const router = express.Router()
const {getVoucher, addVoucher, getCommonType, getCustomer, getSupplier, getRecoverringEmail, verifyAndRecoverPassword} = require("../controllers/otherController");
const authentication = require("../middlewares/authentication");

router.get("/voucher/get-voucher", getVoucher)
router.post("/voucher/add-voucher", authentication, addVoucher)
router.get("/common/get-common-type", getCommonType)

router.get("/customer/get-customer", authentication, getCustomer)

router.get("/supplier/get-supplier", getSupplier)
router.get("/cover-password/get-recoverring-email", getRecoverringEmail)

router.post("/cover-password/verify", verifyAndRecoverPassword)

module.exports = router;