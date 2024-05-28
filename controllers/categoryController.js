const sql = require('mssql')
const {getCategoryQuery, STOREPROCEDURES} = require('../dbQuery/mssql')
const { mssqlDBConfig } = require('../config/dbConfig')
const SqlParameter = require('../models/param')
const { sqlConnection } = require('../utils/dbUtils')
const Response = require('../models/response')

const getCategory = async (req, res) => {
    const {category = null, categoryId = null} = req.query

    var params = [
        new SqlParameter('category', sql.NVarChar(100), category),
        new SqlParameter('id', sql.Int, categoryId)
    ]

    sqlConnection(sql, params, STOREPROCEDURES.GETCATEGORY)
        .then(output =>{

            let recordSet = output.recordsets[0]
            res.json(recordSet)
        })
        .catch(err => {
            console.log(err)
            res.json(new Response(-1, 'Error happened'))
        })
}

const updateCategory = async (req, res) => {
    const {categoryId = null, category = null, description = null} = req.body

    if(!categoryId){
        res.json(new Response(-1, 'CategoryId not to be provided'))
        return
    }

    if(!res.locals.userData || !res.locals.userData.user || !res.locals.userData.user.id || !res.locals.userData.user.isAdmin){
        res.json(new Response(-1, 'Unauthorized'))
        return
    }
    
    
    var params = [
        new SqlParameter('id', sql.Int, categoryId),
        new SqlParameter('name', sql.NVarChar(100), category),
        new SqlParameter('description', sql.NVarChar(sql.MAX), description),
        new SqlParameter('returnCode', sql.Int, null, 'OUTPUT'),
        new SqlParameter('returnMessage', sql.NVarChar(sql.MAX), 'OUTPUT')
    ]




    sqlConnection(sql, params, STOREPROCEDURES.ADMIN_UPDATECATEGORY)
        .then(output =>{

            let {returnCode, returnMessage} = output.output

            if(parseInt(returnCode) == 0){
                res.json(new Response(0, 'Success'))
                return
            }

            res.json(new Response(-1, returnMessage))
            return
        })
        .catch(err => {
            console.log(err)
            res.json(new Response(-1, 'Error happened'))
        })
}

module.exports = {getCategory, updateCategory}
