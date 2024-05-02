const express = require("express");
const authentication = require("../middlewares/authentication");
const router = express.Router()
const {getCartItem, updateCartItem, deleteCartItem, addToCart} = require('../controllers/cartController')

router.use(authentication)
router.get('/get-cart-items', getCartItem)
router.put('/update-cart-item', updateCartItem)
router.delete('/delete-cart-item', deleteCartItem)
router.post("/add-to-cart", addToCart)

module.exports = router;