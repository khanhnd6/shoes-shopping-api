const redis = require("redis")
require('dotenv').config(); 

var mssqlDBConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    synchronize: true,
    trustServerCertificate: true,
}

const redisClientConfig = {
    url: `rediss://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    password: process.env.REDIS_PASSWORD
    // host: process.env.REDIS_HOST,
    // port: process.env.REDIS_PORT,
    // password: process.env.REDIS_PASSWORD
};


module.exports = {mssqlDBConfig, redisClientConfig}