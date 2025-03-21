const mongoose = require('mongoose')

const UserModel = require('../models/users')

const bcrypt = require('bcrypt')

// function to get all users

const Get_All_Users = async (req,res)=>{
    
    const {_id} = req.id

    const user = await UserModel.findById(_id)

    if (!user){

        return res.status(404).json({error:"Opps user not found"})
    }

    if (user.role==="admin"){

        const users = await UserModel.find({groups_ID:_id})

        if (!users){
            return res.status(404).json({error:"Opps no user found"})
        }

        return res.status(200).json(users)
    }
}

// function to get a single user

const Get_Single_User = async (req,res)=>{

    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error:"Invalid Id"})
    }

    const user = await UserModel.findById(id)

    if (!user){
        return res.status(404).json({error:"Opps user not found"})
    }

    return res.status(200).json(user)
}

// function to create user

const Create_User = async (req,res) =>{
    const {name, email,password,role,avatar,tasks,createdAt,updatedAt } = req.body
    const {id} = req.params

    const is_admin = await UserModel.findById(id)

    if (!is_admin){
        return res.status(404).json({error:"Opps either user not found or you can't create a user by this account"})
    }

    if (is_admin.role!=="admin"){
        return res.status(404).json({error:"you can't create a user by this account"})
    }

    const user = await UserModel.create({name, email,password,role,avatar,tasks,createdAt,updatedAt })

    if (!user){
        return res.status(505).json({error:"user not created because of internal server error"})
    }

    return res.status(200).json(user)
}

const Edit_User = async (req,res)=>{
    const {_id} = req.id
    const {name,email,password,newpass,avatar} = req.body
    try {
        const olduser = await UserModel.findOne({_id})

        if (password){
            
            if (bcrypt.compare(password,olduser.password)){
                const hashed = await bcrypt.hash(newpass,8)
                const user = await UserModel.findOneAndUpdate({_id:_id},{name,email,password:hashed,avatar} )
                return res.status(200).json(user)
            }

            return res.status(400).json({error:"Old password is not correct"})
            
        }

        const user = await UserModel.findOneAndUpdate({_id:_id},{name,email,avatar} )
        
        return res.status(200).json(user)

        
    } catch (error) {
        return res.status(400).json({error: error})   
    }
}

module.exports = {Get_All_Users,Get_Single_User,Create_User,Edit_User}