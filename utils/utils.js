
const  bcrypt = require('bcrypt')
const SALT_ROUNDS = 10

const matchPassword = (hash, password) => {
    return bcrypt.compare(password, hash, (err, result)=>{
        if (err) return false
        console.log(result)
        return true
    })
}

const hashPassword = async (password) => {
    await bcrypt(password,SALT_ROUNDS, (err, encoded) => {
        if(err)
            return ''
        return encoded
    })
}

const isAllNumber = (input, exceptions = []) => {
    for (let i in input){
        if(exceptions.includes(input[i]))
            continue
        if(input[i].charCodeAt() < 48 || input[i].charCodeAt() > 57 )
            return false
    }

    return true
}

module.exports = {matchPassword, isAllNumber}