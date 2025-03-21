const mongoose = require('mongoose')

const userModel = require('../models/users')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const SignUser = (id)=>{
    return jwt.sign({_id:id},process.env.SECRET,{expiresIn:"1d"})
}

// function for user sign up

const User_Sign_Up = async (req,res)=>{

    const {name,email,password,role} = req.body

    if (!name || !email || !password){
        return res.status(400).json({error:"bad request"})
    }

    const old_user = await userModel.findOne({email:email})

    if (old_user){
        return res.status(400).json({error:"User already exist by this email"})
    }

    try {

        const hash = await bcrypt.hash(password,8)
        
        const user = await userModel.create({name,email,password:hash,role})
        const token = SignUser(user._id)

        return res.status(200).json({user,token})
    }

    catch(e){
        return res.status(500).json({error:e})
    }

}

// function for user login

const User_Log_In = async (req,res)=>{

    const {email,password} = req.body

    const user = await userModel.findOne({email:email})

    if (!user){
        return res.status(404).json({error:"User not found. Please check ur email"})
    }

    const match = await bcrypt.compare(password,user.password)

    if (!match){
        return res.status(400).json({error:"Invalid credential"})
    }

    const token = SignUser(user._id)

    return res.status(200).json({user,token})

}

module.exports = {User_Sign_Up,User_Log_In}