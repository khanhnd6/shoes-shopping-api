const {STOREPROCEDURES} = require('../dbQuery/mssql');
const sql = require('mssql');
const SqlParameter = require('../models/param');
const { sqlConnection } = require('../utils/dbUtils');
const Response = require('../models/response');
const { isAllNumber } = require('../utils/utils');

const getVoucher = async (req, res) => {
    const {
        voucherId = null,
        voucherCode = null,
        voucherType = null,
        fromExpiredTime = null,
        toExpiredTime = null
    } = req.body

    const params = [
        new SqlParameter("id", sql.Int, voucherId),
        new SqlParameter("code", sql.VarChar(15), voucherCode),
        new SqlParameter("voucherType", sql.Int, voucherType),
        new SqlParameter("fromExpiredTime", sql.DateTime, fromExpiredTime),
        new SqlParameter("toExpiredTime", sql.DateTime, toExpiredTime)
    ]

    sqlConnection(sql, params, STOREPROCEDURES.GETVOUCHER)
        .then(out => {
            const result = out.recordsets[0]
            res.json(result)
            return
        })
        .catch(err => {
            res.json("err: "+ err.message)
            return
        })
}

const addVoucher = async (req, res) => {
    const {
        voucherCode = null,
        value = null,
        voucherType = null,
        fromPrice = null,
        applyFor = null, // array of ...
        expiredTime = null,
        description = null
    } = req.body


    if(!res.locals.userData || !res.locals.userData.user || !res.locals.userData.user.id || !res.locals.userData.user.isAdmin){
        res.json(new Response(-1, 'Unauthorized'))
        return
    }

    if(voucherCode == null || voucherType == null || expiredTime == null){
        res.json(new Response(-1, "voucher code, expired time and voucher type have to be not null"))
        return
    }

    if(value == null && fromPrice == null){
        res.json(new Response(-1, "value and fromPrice not allow to be null simultaniously"))
        return
    }

    let applyForIds = null

    if(applyFor != null && applyFor.length != 0){
        applyForIds = null
        applyForIds = applyFor.reduce((prev, curr) => prev + "," + curr, "").slice(1)
        if(!isAllNumber(applyForIds, [','])){
            res.json(new Response(-1, "Applyfor is not allow to be Characters"))
            return
        }
    }


    const params = [
        new SqlParameter("voucherCode", sql.VarChar(15), voucherCode),
        new SqlParameter("value", sql.Float, value),
        new SqlParameter("voucherType", sql.Int, voucherType),
        new SqlParameter("fromPrice", sql.Float, fromPrice),
        new SqlParameter("applyFor", sql.NVarChar(sql.MAX), applyForIds),
        new SqlParameter("expiredTime", sql.DateTime, expiredTime),
        new SqlParameter("description", sql.NVarChar(sql.MAX), description),
        new SqlParameter("returnCode", sql.Int, null, "OUTPUT"),
        new SqlParameter("returnMessage", sql.NVarChar(sql.MAX), null, "OUTPUT")
    ]

    sqlConnection(sql, params, STOREPROCEDURES.ADDVOUCHER)
    .then(output => {
        const {returnCode, returnMessage} = output.output
        if(returnCode == 0){
            res.json(new Response(0, "SUCCESS"))
            return
        }
        res.json(-1, returnMessage)
        return
    })
    .catch(err => {
        res.json(new Response(-1, "error: " + err.message))
        return
    })

}

const getCommonType = async (req, res) => {
    const {type = null} = req.body
    const params = [new SqlParameter("type", sql.NVarChar(sql.MAX), type)]
    sqlConnection(sql, params, STOREPROCEDURES.GETCOMMON)
    .then(output => {
        res.json(output.recordsets[0])
        return
    })
    .catch(err => {
        res.json(new Response(-1, "error: " + err.message))
    })
}


const getCustomer = async (req, res) => {
    const {
        name = null,
        number = null,
        city = null,
        address = null,
        region = null,
    } = req.body

    if(!res.locals.userData || !res.locals.userData.user || !res.locals.userData.user.id || !res.locals.userData.user.isAdmin){
        res.json(new Response(-1, 'Unauthorized'))
        return
    }

    const params = [
        new SqlParameter("name", sql.NVarChar(sql.MAX), name),
        new SqlParameter("number", sql.NVarChar(sql.MAX), number),
        new SqlParameter("city", sql.NVarChar(sql.MAX), city),
        new SqlParameter("address", sql.NVarChar(sql.MAX), address),
        new SqlParameter("region", sql.NVarChar(sql.MAX), region),
    ]

    sqlConnection(sql, params, STOREPROCEDURES.GETCUSTOMER)
    .then(output => {
        const result = output.recordsets[0]
        res.json(result)
        return 
    })
    .catch(err => {
        res.json(new Response(-1, "error: " + err.message))
        return
    })

}

module.exports = {getVoucher, addVoucher, getCommonType, getCustomer}
