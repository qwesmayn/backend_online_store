const jwt = require("jsonwebtoken")

module.exports = function (role){
    return function(req, res, next){
        if(req.method === "OPTIONS"){
            next()
        }
        try {
            const token = req.headers.authorization.split(' ')[1]
            if(!token){
                res.status(401).json({messsage : "Не авторизован"})
            }
            const decode = jwt.verify(token, process.env.SECRET_KEY)
            if(decode.role != role){
                res.status(403).json({messsage : "Не доступа"})
            }
            req.user = decode
            next()
        } catch (error) {
            res.status(401).json({messsage : "Не авторизован"})
        }
    }
}