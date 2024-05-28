const {STOREPROCEDURES} = require('../dbQuery/mssql');
const sql = require('mssql');
const SqlParameter = require('../models/param');
const { sqlConnection } = require('../utils/dbUtils');
const Response = require('../models/response');
const { isAllNumber } = require('../utils/utils');
const { getCaching } = require('../services/redisCachingService');
const { genarateCode } = require('../utils/redisCaching');
const { sendRecoverringPasswordMail } = require('./emailController');
const nodemailer = require("nodemailer")

const getVoucher = async (req, res) => {
    const {
        voucherId = null,
        voucherCode = null,
        voucherType = null,
        fromExpiredTime = null,
        toExpiredTime = null
    } = req.query

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
    const {type = null} = req.query
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
    } = req.query

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



const getSupplier = async (req, res) => {
    const {supplier = null, supplierId = null} = req.query

    var params = [
        new SqlParameter('name', sql.NVarChar(100), supplier),
        new SqlParameter('id', sql.Int, supplierId)
    ]

    sqlConnection(sql, params, STOREPROCEDURES.GETSUPPLIER)
        .then(output =>{
            let recordSet = output.recordsets[0]
            res.json(recordSet)
        })
        .catch(err => {
            console.log(err)
            res.json(new Response(-1, 'Error happened'))
        })
}


const getRecoverringEmail = async (req, res) => {
    const {username = null} = req.query

    if(username == null){
        res.json(new Response(-1, "username cannot be null"))
    }

    var params = [
        new SqlParameter('username', sql.VarChar(50), username),
        new SqlParameter('email', sql.NVarChar(sql.MAX), null, "OUTPUT"),
    ]

    sqlConnection(sql, params, STOREPROCEDURES.GETEMAIL)
        .then(output =>{
            const email = output.output.email
            if(email == null){
                res.json(new Response(-1, 'Wrong username'))
                return
            }
            res.json(new Response(-1, 'Success', {email}))
            return
        })
        .catch(err => {
            console.log(err)
            res.json(new Response(-1, 'Error happened'))
            return
        })
}


const verifyAndRecoverPassword = async (req, res) => {
    const {username = null, code = null} = req.body

    if(username == null || code == null){
        res.json(new Response(-1, 'username or code not found'))
        return
    }

    let redisVal = await getCaching("RECOVER:"+username);
    
    if(!redisVal){
        res.json(new Response(-1, 'username not found or your code expired'))
        return
    }

    redisVal = JSON.parse(redisVal);

    if(redisVal.username == username && redisVal.code == code){
        
        const newPassword = genarateCode(10)

        const params = [
            new SqlParameter("username", sql.VarChar(50), username),
            new SqlParameter("password", sql.VarChar(100), newPassword),    
            new SqlParameter("returnCode", sql.Int, null, "OUTPUT"),
            new SqlParameter("returnMessage", sql.NVarChar(sql.MAX), null, "OUTPUT"),
            new SqlParameter("mailTo", sql.NVarChar(sql.MAX), null, "OUTPUT")
        ]
        
        sqlConnection(sql, params, STOREPROCEDURES.CHANGEPASSWORD)
        .then(output => {
            const {returnCode, returnMessage, mailTo} = output.output
            if(returnCode == 0){        
         
                res.json(new Response(0, "CHECK YOUR EMAIL FOR YOUR NEW GENARATED PASSWORD, we will send it in second"))

                var transporter =  nodemailer.createTransport({ 
                    host: process.env.TRANSPORT_HOST,
                    port: process.env.TRANSPORT_PORT,
                    secure: true,
                    auth: {
                        user: process.env.SENDER_USERNAME,
                        pass: process.env.SENDER_PASSWORD
                    },
                });

                var content = '';
                content += `
                    <div style="padding: 10px; background-color: #003375">
                        <div style="padding: 10px; background-color: white;">
                            <h4 style="color: red; font-size: 30px; text-align: center;">YOUR NEW PASSWORD</h4>
                            <div>
                                <p style="color: #003375; font-size: 16px;">
                                    Chúng tôi cung cấp cho bạn mật khẩu mới hệ thống ShoesShopping, đổi lại mật khẩu nếu cần thiết.
                                </p>
                                <p>Mật khẩu của bạn là: </p>
                                <div style="text-align: center; margin: 40px 0 20px 0;">
                                    <span style="background-color: #003375; color: white; font-size: 17px; font-weight: bold; text-align: center;padding: 20px 40px;">
                                        ${newPassword}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                var mainOptions = {
                    to: mailTo,
                    subject: 'Your new genarated pasword',
                    html: content
                }
                
                            
                transporter.sendMail(mainOptions)

            } 
            else {    
                res.json(new SqlParameter(-1, returnMessage))
            }
        })
        .catch(err => {
            console.log(err)
            res.json(new Response(-1, "error: " + err.message))
            return
        })
        
    } else {    
        res.json(new Response(-1, 'wrong username/code'))
        return
    }

}




module.exports = {getVoucher, addVoucher, getCommonType, getCustomer, getSupplier, getRecoverringEmail, verifyAndRecoverPassword}
