const { mssqlDBConfig } = require("../config/dbConfig")

const sqlConnection = async (sql, params, spname) => {
    try{
        const connection = await sql.connect(mssqlDBConfig)

        const request = await connection.request();



        // SqlParameter
        for(let param of params){
            if(param.direction == 'INPUT'){
                request.input(param.name, param.type, param.value)
            } else {
                request.output(param.name, param.type)
            }

        }

        const output = await request.execute(spname)

        return output

    } catch(err){
        throw err
    } finally{
        if(sql){
            await sql.close()
        }
    }
}

module.exports = {sqlConnection}