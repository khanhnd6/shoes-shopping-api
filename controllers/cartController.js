const sql = require('mssql')
const Response = require('../models/response')
const SqlParameter = require('../models/param')
const { sqlConnection } = require('../utils/dbUtils')
const { STOREPROCEDURES } = require('../dbQuery/mssql')

const getCartItem = async (req, res) => {

    const authHeader = req.headers.authorization
    const token = authHeader.split(' ')[1]
    

    if(!token || !res.locals.userData || !res.locals.userData.user || !res.locals.userData.user.id)
    {
        res.json(new Response(-1, 'Unauthorized'))
        return
    }

    const customerID = res.locals.userData.user.id
   
    const params = [new SqlParameter('customerId', sql.Int, customerID)]

    sqlConnection(sql, params, STOREPROCEDURES.GETCARTITEMS)
        .then(output => {
            let recordSet = output.recordsets[0]
            recordSet.forEach(record => {
                if (record.path && record.path[0] !== 'h') {
                    // Assuming path are separated by commas within the image field
                    const elements = record.path.split(',');
                    const updatedElements = elements.map(element => `http://localhost:${process.env.PORT}${element}`);
                    record.path = updatedElements.join(',');
                }
            });
            res.json(recordSet)
        })
        .catch( err => {
            console.log(err)
            res.json(new Response(-1, 'Error happened'))
        })
}

const updateCartItem = async (req, res) => {
    const {productId = null, quantity = null} = req.body
    
    if(!productId || !quantity){
        res.json(new Response(-1, 'ProductId/Quantity not allow to null'))
        return
    }


    if(!res.locals.userData || !res.locals.userData.user || !res.locals.userData.user.id){
        res.json(new Response(-1, 'Unauthorized'))
        return
    }
    
    if(res.locals.userData.user.isAdmin){
        res.json(new Response(-1, 'Admin not allow here'))
        return
    }

    const customerId = res.locals.userData.user.id

    const params = [
        new SqlParameter('productid', sql.Int, productId),
        new SqlParameter('customerId', sql.Int, customerId),
        new SqlParameter('quantity', sql.Int, quantity),
        new SqlParameter('returnCode', sql.Int, null, 'OUTPUT'),
        new SqlParameter('returnMessage', sql.Int, null,'OUTPUT')
    ]


    sqlConnection(sql, params, STOREPROCEDURES.UPDATECARTITEM)
        .then( output => {
            const {returnCode, returnMessage} = output.output

            if(parseInt(returnCode) == -1){
                res.json(new Response(-1, returnMessage))
                return
            }

            res.json(new Response(0, 'Success'))
            return
        })
        .catch(err=>{
            res.json(new Response(-1, 'Error: ' + err.message))
        })
}


const deleteCartItem = async (req, res) => {
    const {id = null} = req.body
    
    if(!res.locals.userData || !res.locals.userData.user || !res.locals.userData.user.id){
        res.json(new Response(-1, 'Unauthorized'))
        return
    }

    if(res.locals.userData.user.isAdmin){
        res.json(new Response(-1, 'Admin not allow here'))
        return
    }

    if(id == null){
        res.json(new Response(-1, 'ProductId/Quantity not allow to null'))
        return
    }
    
    const customerId = res.locals.userData.user.id

    const params = [
        new SqlParameter('id', sql.Int, id),
        new SqlParameter('returnCode', sql.Int, null, 'OUTPUT'),
        new SqlParameter('returnMessage', sql.NVarChar(sql.MAX), null,'OUTPUT')
    ]


    sqlConnection(sql, params, STOREPROCEDURES.DELETECARTITEM)
        .then( output => {
            const {returnCode, returnMessage} = output.output

            if(parseInt(returnCode) == -1){
                res.json(new Response(-1, returnMessage))
                return
            }

            res.json(new Response(0, 'Success'))
            return
        })
        .catch(err=>{
            res.json(new Response(-1, 'Error: ' + err.message))
        })
}


const addToCart = async (req, res) => {
    const {productId = null, quantity = null} = req.body
    
    if(!productId || quantity == null || quantity <= 0){
        res.json(new Response(-1, 'ProductId/Quantity not allow to null or quantity <= 0'))
        return
    }


    if(!res.locals.userData || !res.locals.userData.user || !res.locals.userData.user.id){
        res.json(new Response(-1, 'Unauthorized'))
        return
    }

    if(res.locals.userData.user.isAdmin){
        res.json(new Response(-1, 'Admin not allow here'))
        return
    }
    
    const customerId = res.locals.userData.user.id

    const params = [
        new SqlParameter('productId', sql.Int, productId),
        new SqlParameter('customerId', sql.Int, customerId),
        new SqlParameter('quantity', sql.Int, quantity),
        new SqlParameter('returnCode', sql.Int, null, 'OUTPUT'),
        new SqlParameter('returnMessage', sql.NVarChar(sql.MAX), null,'OUTPUT')
    ]

    sqlConnection(sql, params, STOREPROCEDURES.ADDTOCART)
        .then( output => {
            const {returnCode, returnMessage} = output.output

            if(parseInt(returnCode) == -1){
                res.json(new Response(-1, returnMessage))
                return
            }

            res.json(new Response(0, 'Success'))
            return
        })
        .catch(err=>{
            res.json(new Response(-1, 'Error: ' + err.message))
        })
}


module.exports = {getCartItem, updateCartItem, deleteCartItem, addToCart}