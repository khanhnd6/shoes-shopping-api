const express = require("express");
const router = express.Router()
const {getProduct, getProductDetails, updateProduct, showHideProduct, addProduct, deleteProduct} = require("../controllers/productController");
const authentication = require("../middlewares/authentication");
const { upload } = require("../utils/uploadFunc");




router.get('/get-product', getProduct)
router.get("/get-product-details", getProductDetails)
router.put('/update-product', authentication, updateProduct)
router.put('/show-hide-product', authentication, showHideProduct)
router.post('/add-product', authentication, upload.array("srcs"), addProduct)
router.delete('/delete-product', authentication, deleteProduct)

module.exports = router;