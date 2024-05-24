require('dotenv').config(); 

var mssqlDBConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    synchronize: true,
    trustServerCertificate: true,
}


// const server = process.env.AZURE_SQL_SERVER;
// const database = process.env.AZURE_SQL_DATABASE;
// const port = parseInt(process.env.AZURE_SQL_PORT);
// const user = process.env.AZURE_SQL_USER;
// const password = process.env.AZURE_SQL_PASSWORD;

// const mssqlDBConfig = {
//     server,
//     port,
//     database,
//     user,
//     password,
//     options: {
//         encrypt: true
//     }
// };



module.exports = {mssqlDBConfig}