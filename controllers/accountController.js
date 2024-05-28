const mssql = require('mssql')

const bcrypt = require('bcrypt')

const {mssqlDBConfig} = require('../config/dbConfig')

const {STOREPROCEDURES} = require('../dbQuery/mssql')

const Response = require('../models/response')

const {genarateAccessToken} = require('../utils/tokenUtils')

const {sqlConnection} = require('../utils/dbUtils')
const SqlParameter = require('../models/param')
const {isAllNumber} = require("../utils/utils")
const login = async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password){
        res.json(new Response(-1, 'Username and Password cannot be empty'));
        return 
    }
   
    const params = [
        new SqlParameter('username', mssql.VarChar, username), 
        new SqlParameter('password', mssql.VarChar, password),
        new SqlParameter('returnCode', mssql.Int, null, 'OUTPUT'),
        new SqlParameter('id', mssql.Int,null, 'OUTPUT'),
        new SqlParameter('firstName', mssql.NVarChar(100),null, 'OUTPUT'),
        new SqlParameter('lastName', mssql.NVarChar(100),null, 'OUTPUT'),
        new SqlParameter('email', mssql.NVarChar(mssql.MAX),null, 'OUTPUT'),
    ]

    sqlConnection(mssql, params, STOREPROCEDURES.LOGIN)
        .then(output => {
            const {returnCode, id, firstName, lastName, email} = output.output
            if(parseInt(returnCode) == 0){
                const accessToken = genarateAccessToken(username, password, id)
                console.log({username, password, id, token: accessToken, firstName, lastName, email})
                res.json(new Response(0, 'Loggin sucessfully', {username, password, id, token: accessToken, firstName, lastName, email}))
                return
            } else {
                res.json(new Response(-1, 'Wrong username/password'))
            }
        })
        .catch(err => {
            console.log('errr: ', err)
            res.json(new Response(-1, 'Error happened'))
        })
};


const adminLogin = async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password)
        return res.json(new Response('-1', 'Username and Password cannot be empty'));
   
    const params = [
        new SqlParameter('username', mssql.VarChar, username), 
        new SqlParameter('password', mssql.VarChar, password),
        new SqlParameter('returnCode', mssql.Int, null, 'OUTPUT'),
        new SqlParameter('id', mssql.Int,null, 'OUTPUT')
    ]

    sqlConnection(mssql, params, STOREPROCEDURES.ADMIN_LOGIN)
        .then(output => {
            const {returnCode, id} = output.output
            if(parseInt(returnCode) == 0){
                const accessToken = genarateAccessToken(username, password, id, true)

                res.json(new Response(0, 'Loggin sucessfully', {username, password, id, token: accessToken}))
            } else {
                res.json(new Response(-1, 'Wrong username/password'))
            }
        })
        .catch(err => {
            console.log('errr: ', err)
            res.json(new Response(-1, 'Error happened'))
        })
};

const logout = (req, res) => {
    
}
const changePassword = (req, res) => {

}


const register = async (req, res) => {
    const { firstName = null, lastName = null, contactNumber = null, address = null, city = null, region = null, username = null, password = null} = req.body;
    
    if (!username || !password || !lastName || !address || !contactNumber ){
        res.json(new Response(-1, 'username, password, lastname, address, contact number are required'));
        return
    }
   
    let splittedUsername = username.split(' '), splittedPassword = password.split(' ')

    if(splittedPassword.length > 1 || splittedUsername.length > 1){
        res.json(new Response(-1, "username and password are not allowed having any space"))
        return
    }

    if(contactNumber.length >= 15){
        res.json(new Response(-1, "contact number is invalid"))
        return
    }

    if(!isAllNumber(contactNumber)){
        res.json(new Response(-1, 'contact number not only contain numbers'))
        return;
    }

    

    const params = [
        new SqlParameter('firstname', mssql.NVarChar(100), firstName),
        new SqlParameter('lastname', mssql.NVarChar(200), lastName),
        new SqlParameter('contactNumber', mssql.NVarChar(15), contactNumber),
        new SqlParameter('address', mssql.NVarChar(mssql.MAX), address),
        new SqlParameter('city', mssql.NVarChar(100), city),
        new SqlParameter('region', mssql.NVarChar(100), region),
        new SqlParameter('username', mssql.NVarChar(50), username),
        new SqlParameter('password', mssql.NVarChar(100), password),
        new SqlParameter('returnCode', mssql.Int,null, 'OUTPUT'),
        new SqlParameter('returnMessage', mssql.NVarChar(mssql.MAX),null, 'OUTPUT'),
    ]

    sqlConnection(mssql, params, STOREPROCEDURES.REGISTER)
        .then(output => {
            const {returnCode, returnMessage} = output.output
            if(parseInt(returnCode) == 0){
                res.json(new Response(0, 'Create sucessfully'))
                return
            } else {
                res.json(new Response(-1, returnMessage))
                return
            }
        })
        .catch(err => {
            res.json(new Response(-1, 'Error happened'))
        })
}




module.exports = {login, logout, changePassword, adminLogin, register}

