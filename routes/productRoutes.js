const express = require("express");
const router = express.Router()
const {getProduct, getProductDetails, updateProduct, showHideProduct, addProduct, deleteProduct} = require("../controllers/productController");
const authentication = require("../middlewares/authentication");

router.get('/get-product', getProduct)
router.get("/get-product-details", getProductDetails)
router.put('/update-product', authentication, updateProduct)
router.put('/show-hide-product', authentication, showHideProduct)
router.post('/add-product', authentication, addProduct)
router.delete('/delete-product', authentication, deleteProduct)

module.exports = router;