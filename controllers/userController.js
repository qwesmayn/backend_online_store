const ApiError = require("../error/ApiError")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { User, Basket } = require("../models/models")

const generateJwt = (userId, email, role) =>{
    return jwt.sign({userId, email, role}, process.env.SECRET_KEY, {expiresIn : '24h'})
}

class userController{
    async registration(req, res, next){
        const {email, password , role} = req.body
        if( !email || !password){
            return next(ApiError.badRequest("Неккоректный email или password"))
        }
        const candidat = await User.findOne({ where : {email}})
        if(candidat){
            return next(ApiError.badRequest("Пользователь с такой почтой уже существует"))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({email, password : hashPassword, role})
        const basket = await Basket.create({userId : user.id})
        const token = generateJwt(user.id, user.email, user.role)
        return res.json({token})
    }

    async login(req, res, next){
        const {email, password} = req.body
        const user = await User.findOne({ where : {email}})
        if(!user){
            return next(ApiError.internal("Пользователь не найден"))
        } 
        let comparePassword = bcrypt.compareSync(password, user.password)
        if(!comparePassword){
            return next(ApiError.internal("Неправильный логин или пароль"))
        }
        const token = generateJwt(user.id, user.email, user.role)
        return res.json({token})
    }

    auth(req, res, next){
        const token = generateJwt(req.user.id, req.user.email, req.user.role)   
        return res.json({token})
    }
}

module.exports = new userController()