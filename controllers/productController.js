const {mssqlDBConfig} = require('../config/dbConfig')
const {getProductQuery, STOREPROCEDURES} = require('../dbQuery/mssql');
const sql = require('mssql');
const SqlParameter = require('../models/param');
const { sqlConnection } = require('../utils/dbUtils');
const Response = require('../models/response');

const getProduct = async (req, res) =>{

    const {id = null, code = null, name = null, supplierId = null, supplier = null, categoryId = null, category = null, fromPrice = null, toPrice = null, isHidden = null} = req.body
    

    const params = [
        new SqlParameter('id', sql.Int, id),
        new SqlParameter('code', sql.NVarChar, code),
        new SqlParameter('name', sql.NVarChar, name),
        new SqlParameter('supplierId', sql.Int, supplierId),
        new SqlParameter('supplier', sql.NVarChar, supplier),
        new SqlParameter('categoryId', sql.Int, categoryId),
        new SqlParameter('category', sql.NVarChar, category),
        new SqlParameter('fromPrice', sql.Float, fromPrice),
        new SqlParameter('toPrice', sql.Float, toPrice),
        new SqlParameter('isHidden', sql.Bit, isHidden),
    ]

    sqlConnection(sql, params, STOREPROCEDURES.GETPRODUCT)
        .then(output => {
            
            var recordSet = output.recordsets[0]

            res.json(recordSet)
        })
        .catch(err => {
            console.log('errr: ', err)
            res.json(new Response(-1, 'Error happened'))
        })
}


const updateProduct = async (req, res) =>{

    const {
        productId = null,
        productName = null,
        price = null,
        discount = null,
        quantity = null,
        description = null,
        unitPrice = null,
    } = req.body
    
    if(!productId){
        res.json(new Response(-1, 'ProductId not to be provided'))
        return
    }

    if(!res.locals.userData || !res.locals.userData.user || !res.locals.userData.user.id || !res.locals.userData.user.isAdmin){
        res.json(new Response(-1, 'Unauthorized'))
        return
    }

    const params = [
        new SqlParameter('id', sql.Int, productId),
        new SqlParameter('name', sql.NVarChar(200), productName),
        new SqlParameter('price', sql.Float, price),
        new SqlParameter('discount', sql.Float, discount),
        new SqlParameter('quantity', sql.Int, quantity),
        new SqlParameter('description', sql.NVarChar(sql.MAX), description),
        new SqlParameter('unitPrice', sql.NVarChar(50), unitPrice),
        new SqlParameter('returnCode', sql.Int, null, 'OUTPUT'),
        new SqlParameter('returnMessage', sql.NVarChar(sql.MAX), null, 'OUTPUT'),
    ]

    sqlConnection(sql, params, STOREPROCEDURES.ADMIN_UPDATEPRODUCT)
        .then(output => {
            
            var {returnCode, returnMessage} = output.output

            if(parseInt(returnCode) == 0){
                res.json(new Response(0, 'Success'))
                return
            } 
            res.json(new Response(-1, returnMessage))
            return
        })
        .catch(err => {
            console.log('errr: ', err)
            res.json(new Response(-1, 'Error happened'))
        })
}



const showHideProduct = async (req, res) =>{

    const {
        productId = null,
        productCode = null,
        isShow = null
    } = req.body
    
    if(!productId && !productCode ){
        res.json(new Response(-1, 'Product Info not to be provided'))
        return
    }

    if(isShow == null){
        res.json(new Response(-1, 'isShow not be provided'))
        return
    }

    if(!res.locals.userData || !res.locals.userData.user || !res.locals.userData.user.id || !res.locals.userData.user.isAdmin){
        res.json(new Response(-1, 'Unauthorized'))
        return
    }

    const params = [
        new SqlParameter('id', sql.Int, productId),
        new SqlParameter('productCode', sql.NVarChar(15), productCode),
        new SqlParameter('returnCode', sql.Int, null, 'OUTPUT'),
        new SqlParameter('returnMessage', sql.NVarChar(sql.MAX), null, 'OUTPUT'),
    ]

    sqlConnection(sql, params, parseInt(isShow) == 1 ? STOREPROCEDURES.ADMIN_SHOWPRODUCT : STOREPROCEDURES.ADMIN_HIDEPRODUCT)
        .then(output => {
            var {returnCode, returnMessage} = output.output

            console.log(returnCode, returnMessage)

            if(parseInt(returnCode) == 0){
                res.json(new Response(0, 'Success'))
                return
            } 
            res.json(new Response(-1, returnMessage))
            return
        })
        .catch(err => {
            console.log('errr: ', err)
            res.json(new Response(-1, 'Error happened'))
        })
}

const addProduct = async (req, res) => {

    const { 
        productName = null,
        price = null,
        discount = null,
        code = null,
        size = null,
        quantity = null,
        color = null,
        description = null,
        unitPrice = null,
        supplierId = null,
        categoryId = null } = req.body


    

    if(!res.locals.userData || !res.locals.userData.user || !res.locals.userData.user.id || !res.locals.userData.user.isAdmin){
        res.json(new Response(-1, 'Unauthorized'))
        return
    }
    
    if(!productName || !quantity || !color || !price || !supplierId || !categoryId || !unitPrice){
        res.json(new Response(-1, 'productName, quantity, color, price, supplierId, categoryId and unitPrice are required'))
        return
    }

    const params = [
        new SqlParameter('name', sql.NVarChar(200), productName),
        new SqlParameter('price', sql.Float, price),
        new SqlParameter('discount', sql.Float, discount),
        new SqlParameter('code', sql.NVarChar(15), code),
        new SqlParameter('size', sql.NVarChar(100), size),
        new SqlParameter('quantity', sql.Int, quantity),
        new SqlParameter('color', sql.NVarChar(50), color),
        new SqlParameter('description', sql.NVarChar(sql.MAX), description),
        new SqlParameter('unitPrice', sql.NVarChar(50), unitPrice),
        new SqlParameter('supplierId', sql.Int, supplierId),
        new SqlParameter('categoryId', sql.Int, categoryId),
        new SqlParameter('returnCode', sql.Int, null, 'OUTPUT'),
        new SqlParameter('returnMessage', sql.NVarChar(sql.MAX), null, 'OUTPUT'),
    ]


    
    sqlConnection(sql, params, STOREPROCEDURES.ADMIN_ADDPRODUCT)
        .then(output => {
            var {returnCode, returnMessage} = output.output

            console.log(returnCode, returnMessage)

            if(parseInt(returnCode) == 0){
                res.json(new Response(0, 'Success'))
                return
            } 
            res.json(new Response(-1, returnMessage))
            return
        })
        .catch(err => {
            console.log('errr: ', err)
            res.json(new Response(-1, 'Error happened'))
        })

}


const deleteProduct = async (req, res) => {

    const { productId = null, productCode = null} = req.body

    
    if(!res.locals.userData || !res.locals.userData.user || !res.locals.userData.user.id || !res.locals.userData.user.isAdmin){
        res.json(new Response(-1, 'Unauthorized'))
        return
    }
    
    if(!productId && !productCode){
        res.json(new Response(-1, 'ProductId and ProductCode are not provided'))
        return
    }

    const params = [
        new SqlParameter('id', sql.Int, productId),
        new SqlParameter('productCode', sql.NVarChar(15), productCode),
        new SqlParameter('returnCode', sql.Int, null, 'OUTPUT'),
        new SqlParameter('returnMessage', sql.NVarChar(sql.MAX), null, 'OUTPUT'),
    ]


    
    sqlConnection(sql, params, STOREPROCEDURES.ADMIN_DELETEPRODUCT)
        .then(output => {
            var {returnCode, returnMessage} = output.output

            console.log(returnCode, returnMessage)

            if(parseInt(returnCode) == 0){
                res.json(new Response(0, 'Success'))
                return
            } 
            res.json(new Response(-1, returnMessage))
            return
        })
        .catch(err => {
            console.log('errr: ', err)
            res.json(new Response(-1, 'Error happened'))
        })

}


module.exports = {
    getProduct,
    updateProduct,
    showHideProduct,
    addProduct,
    deleteProduct
}