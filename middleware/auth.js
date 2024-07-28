const jwt = require("jsonwebtoken");
const config = require("../config/config")

const verifyToken = async (req, res, next)=>{
    const token = req.body.token || req.query.token ||  req.headers["authorization"];
    console.log(token);
    if(!token){
        return res.status(403).send("A token is required for authentication");
    }

    try{
        const decode =  jwt.verify(token, config.jwtSecertKey);
        req.user = decode;
    }catch(error){
        res.status(400).send("Invalid Token");
    }
    return next();
}

module.exports = verifyToken