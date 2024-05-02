const express = require("express");
const router = express.Router()
const {getVoucher, addVoucher, getCommonType} = require("../controllers/otherController");
const authentication = require("../middlewares/authentication");

router.get("/voucher/get-voucher", getVoucher)
router.post("/voucher/add-voucher", authentication, addVoucher)
router.get("/common/get-common-type", getCommonType)

module.exports = router;