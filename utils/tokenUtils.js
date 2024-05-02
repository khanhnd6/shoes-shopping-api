const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');

// get config vars
dotenv.config();

// access config var
process.env.ACCESS_TOKEN_SECRET_KEY;

function genarateAccessToken(username, password, id, isAdmin = false){
    return jwt.sign({
        user: {username, password, id, isAdmin}
    }, process.env.ACCESS_TOKEN_SECRET_KEY, {expiresIn: process.env.EXPIRATION_TIME})
}

async function verifyJwtToken(token){
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, decoded) => {
            if(err)
                return reject(err)
            return resolve(decoded)
        })
    })
}

module.exports = {genarateAccessToken, verifyJwtToken}