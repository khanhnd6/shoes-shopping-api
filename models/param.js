const sql = require('mssql')

class SqlParameter {
    constructor(name, type, value = null, direction = 'INPUT'){
        this.name = name
        this.type = type
        this.direction = direction.toUpperCase()

        if(this.direction === 'OUTPUT'){
            this.value = null
        } else {
            this.direction = 'INPUT'
            this.value = value
        }
    }
}

module.exports = SqlParameter