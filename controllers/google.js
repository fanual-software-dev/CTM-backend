
const userModel = require('../models/users')

const jwt = require('jsonwebtoken')


const SignUser = (id)=>{
    return jwt.sign({_id:id},process.env.SECRET,{expiresIn:"1d"})
}

// function for user sign up

const Google_Sign_Up = async (req,res)=>{

    const {name,email,role} = req.body

    if (!name || !email){
        return res.status(400).json({error:"bad request"})
    }

    const old_user = await userModel.findOne({email:email})

    if (old_user){
        return res.status(400).json({error:"User already exist by this email"})
    }

    try {

        
        
        const user = await userModel.create({name,email,role,password:"none"})
        const token = SignUser(user._id)

        if (user){
            return res.status(200).json({user,token})
        }

        return res.status(400).json({error:"User not created"})

        
    }

    catch(e){
        return res.status(500).json({error:e})
    }

}

// function for user login

const Google_Log_In = async (req,res)=>{

    const {email} = req.body
    console.log(email)

    const user = await userModel.findOne({email:email})

    if (!user){
        return res.status(404).json({error:"User not found. Please check ur email"})
    }


    const token = SignUser(user._id)

    return res.status(200).json({user,token})

}

module.exports = {Google_Log_In,Google_Sign_Up}