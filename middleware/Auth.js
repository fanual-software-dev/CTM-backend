const jwt = require('jsonwebtoken')
const UserModel = require('../models/users')

const AuthMiddleware = async (req,res,next)=>{
    const {authorization} = req.headers
    

    if (!authorization){
       
        return res.status(400).json({error:"Unauthorized request. Authorization not found."})
    }
    
    const token = authorization.split(' ')[1]

    const uid = jwt.verify(token,process.env.SECRET)

    const user = await UserModel.findOne({_id:uid})


    if (!user){
         return res.status(404).json({error:"No such user. Please try again."})
    }

    req.id = uid
    next()
}

module.exports = AuthMiddleware