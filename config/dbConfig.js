require('dotenv').config(); 

var mssqlDBConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    synchronize: true,
    trustServerCertificate: true,
}



module.exports = {mssqlDBConfig}