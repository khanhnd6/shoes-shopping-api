const jwt = require("jsonwebtoken")
const Response = require("../models/response")

const authentication = async (req, res, next) => {

    const authHeader = req.headers.authorization

    if(!authHeader){
        res.json(new Response(-1, 'Unauthorized'))
        return
    }

    const tokenPair = authHeader.split(' ')
    
    const token = tokenPair[1]

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, user) =>{
        if (err) return res.json(new Response(-1, 'Unauthorized'))
        res.locals.userData = user
        next()
    })
}


module.exports = authentication