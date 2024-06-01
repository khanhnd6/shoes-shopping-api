const express = require("express");
const router = express.Router()
const {makingOrderFromCart, makingOrderQuickly, getOrders, getOrderItems, cancelOrder, getOrdersAdmin, changeOrderStatus} = require("../controllers/orderController");
const authentication = require("../middlewares/authentication");

router.use(authentication)

router.post("/order-from-cart", makingOrderFromCart)

router.post("/order-quickly", makingOrderQuickly)

router.get("/get-order-items", getOrderItems)

router.get("/get-orders", getOrders)

router.post("/cancel-order", cancelOrder)

router.get("/get-orders-admin", getOrdersAdmin)

router.put("/change-order-status", changeOrderStatus)

module.exports = router;