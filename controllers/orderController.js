const {STOREPROCEDURES} = require('../dbQuery/mssql');
const sql = require('mssql');
const SqlParameter = require('../models/param');
const { sqlConnection } = require('../utils/dbUtils');
const Response = require('../models/response');
const { isAllNumber } = require('../utils/utils');

const makingOrderFromCart = async (req, res) => {

    const {
        cartItemsIds = null, // array
        paymentType = null,
        paymentStatus = 0,
        shippingCity = null,
        shippingRegion = null,
        shippingAddress = null,
        shippingFee = null,
        note = null,
        voucherCode = null
    } = req.body


    if(cartItemsIds == null || cartItemsIds.length == 0 || paymentType == null || shippingFee == null){
        res.json(new Response(-1, "productIds, paymentType and shippingFee are requiried"))
        return
    }

    if(!res.locals.userData || !res.locals.userData.user || !res.locals.userData.user.id ){
        res.json(new Response(-1, 'Unauthorized'))
        return
    }
    
    if(res.locals.userData.user.isAdmin){
        res.json(new Response(-1, "Admin is not privided"))
        return
    }
    
    const today = new Date()
    const shippingDate = new Date()
    today.setDate(today.getDate() +Math.random()*5)

    const customerId = res.locals.userData.user.id

    const pcartItemsIds = cartItemsIds.reduce((prev, curr) => prev + "," + curr, "").slice(1);

    if(!isAllNumber(pcartItemsIds, [','])){
        res.json(new Response(-1, "Ids is not allow to be Characters"))
        return
    }


    const params = [
        new SqlParameter("cartItemsIds", sql.NVarChar(sql.MAX), pcartItemsIds),
        new SqlParameter("customerId", sql.Int, customerId),
        new SqlParameter("paymentType", sql.Int, paymentType),
        new SqlParameter("paymentStatus", sql.Int, paymentStatus),
        new SqlParameter("shippingCity", sql.NVarChar(sql.MAX), shippingCity),
        new SqlParameter("shippingRegion", sql.NVarChar(sql.MAX), shippingRegion),
        new SqlParameter("shippingAddress", sql.NVarChar(sql.MAX), shippingAddress),
        new SqlParameter("shippingDate", sql.DateTime, shippingDate),
        new SqlParameter("shippingFee", sql.Float, shippingFee),
        new SqlParameter("note", sql.NVarChar(sql.MAX), note),
        new SqlParameter("voucherCode", sql.NVarChar(200), voucherCode),
        new SqlParameter("returnCode", sql.Int, null, "OUTPUT"),
        new SqlParameter("returnMessage", sql.NVarChar(sql.MAX), null, "OUTPUT"),
    ]
    
    sqlConnection(sql, params, STOREPROCEDURES.MAKINGORDERFROMCART)
        .then( output => {
            const {returnCode, returnMessage} = output.output

            console.log(returnCode, returnMessage)
            
            if(parseInt(returnCode) == -1){     
                res.json(new Response(-1, returnMessage))
                return
            }

            res.json(new Response(0, 'Success'))
            return
        })
        .catch(err=>{
            res.json(new Response(-1, 'Error: ' + err))
            return
        })

}


const makingOrderQuickly = async (req, res) => {

    const {
        productId = null,
        quantity = null,
        paymentType = null,
        paymentStatus = null,
        shippingCity = null,
        shippingRegion = null,
        shippingAddress = null,
        shippingFee = null,
        note = null,
        voucherCode = null,
    } = req.body


    if(productId == null || paymentType == null || shippingFee == null){
        res.json(new Response(-1, "productId, paymentType and shippingFee are requiried"))
        return
    }

    if(!res.locals.userData || !res.locals.userData.user || !res.locals.userData.user.id ){
        res.json(new Response(-1, 'Unauthorized'))
        return
    }
    
    if(res.locals.userData.user.isAdmin){
        res.json(new Response(-1, "Admin is not privided"))
        return
    }

    if(quantity <= 0){
        res.json(new Response(-1, "Quantity > 1"))
        return
    }
    
    const today = new Date()
    const shippingDate = new Date()
    today.setDate(today.getDate() +Math.random()*5)

    const customerId = res.locals.userData.user.id

    const params = [
        new SqlParameter("productId", sql.Int, productId), 
        new SqlParameter("customerId", sql.Int, customerId), 
        new SqlParameter("quantity", sql.Int, quantity), 
        new SqlParameter("paymentType", sql.Int, paymentType), 
        new SqlParameter("paymentStatus", sql.Int, paymentStatus), 
        new SqlParameter("shippingCity", sql.NVarChar(sql.MAX), shippingCity), 
        new SqlParameter("shippingRegion", sql.NVarChar(sql.MAX), shippingRegion), 
        new SqlParameter("shippingAddress", sql.NVarChar(sql.MAX), shippingAddress), 
        new SqlParameter("shippingDate", sql.DateTime, shippingDate), 
        new SqlParameter("shippingFee", sql.Float, shippingFee), 
        new SqlParameter("note", sql.NVarChar(sql.MAX), note), 
        new SqlParameter("voucherCode", sql.NVarChar(200), voucherCode),
        new SqlParameter("returnCode", sql.Int, null, "OUTPUT"),
        new SqlParameter("returnMessage", sql.NVarChar(sql.MAX), null, "OUTPUT"),
    ]
    
    sqlConnection(sql, params, STOREPROCEDURES.MAKINGORDERQUICKLY)
        .then( output => {
            const {returnCode, returnMessage} = output.output

            console.log(returnCode, returnMessage)

            if(parseInt(returnCode) == -1){     
                res.json(new Response(-1, returnMessage))
                return
            }

            res.json(new Response(0, 'Success'))
            return
        })
        .catch(err=>{
            res.json(new Response(-1, 'Error: ' + err))
            return
        })

}

const getOrders = async (req, res) => {
    if(!res.locals.userData || !res.locals.userData.user || !res.locals.userData.user.id ){
        res.json(new Response(-1, 'Unauthorized'))
        return
    }
    
    if(res.locals.userData.user.isAdmin){
        res.json(new Response(-1, "Admin is not privided"))
        return
    }

    const customerId = res.locals.userData.user.id

    const params = [new SqlParameter("customerId", sql.Int, customerId)]

    sqlConnection(sql, params, STOREPROCEDURES.GETORDERS)
        .then(output => {
            const result = output.recordsets[0]
            res.json(result)
            return
        })
        .catch(err => {
            res.json(new Response(-1, 'Error: ' + err))
            return
        })

}

const getOrderItems = async (req, res) => {
    if(!res.locals.userData || !res.locals.userData.user || !res.locals.userData.user.id ){
        res.json(new Response(-1, 'Unauthorized'))
        return
    }
    
    if(res.locals.userData.user.isAdmin){
        res.json(new Response(-1, "Admin is not privided"))
        return
    }

    const customerId = res.locals.userData.user.id
    
    const params = [new SqlParameter("customerId", sql.Int, customerId)]

    sqlConnection(sql, params, STOREPROCEDURES.GETORDERITEMS)
        .then(output => {
            const result = output.recordsets[0]
            
            res.json(result)
            return
        })
        .catch(err => {
            res.json(new Response(-1, 'Error: ' + err))
            return
        })
}

const cancelOrder = async (req, res) => {
    const {orderId = null} = req.body

    if(!res.locals.userData || !res.locals.userData.user || !res.locals.userData.user.id ){
        res.json(new Response(-1, 'Unauthorized'))
        return
    }
    
    if(res.locals.userData.user.isAdmin){
        res.json(new Response(-1, "Admin is not privided"))
        return
    }

    if(orderId == null){
        res.json(new Response(-1, "orderId has to be provided"))
        return
    }

    const customerId = res.locals.userData.user.id

    const params = [
        new SqlParameter("orderId", sql.Int, orderId),
        new SqlParameter("customerId", sql.Int, customerId),
        new SqlParameter("returnCode", sql.Int, null, "OUTPUT"),
        new SqlParameter("returnMessage", sql.NVarChar(sql.MAX), null, "OUTPUT")
    ]



    sqlConnection(sql, params, STOREPROCEDURES.CANCELORDER)
        .then(output => {
            const {returnCode, returnMessage} = output.output
            if(returnCode == 0){
                res.json(new Response(0, "Cancellation request sent, waiting for the confirmation of the seller"))
                return
            }
            res.json(new Response(-1, returnMessage))
            return
        })


}




module.exports = {makingOrderFromCart, makingOrderQuickly, getOrderItems, getOrders, cancelOrder}