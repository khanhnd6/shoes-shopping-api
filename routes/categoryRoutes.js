const express = require("express");
const router = express.Router()
const {getCategory, updateCategory} = require("../controllers/categoryController");
const authentication = require("../middlewares/authentication");

router.get('/get-category', getCategory)
router.put('/update-category', authentication, updateCategory)

module.exports = router;