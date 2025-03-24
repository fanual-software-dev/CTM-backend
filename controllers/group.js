const GroupModel = require('../models/groups')
const UsersModel = require('../models/users')
const mongoose = require('mongoose')
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: 'asfawfanual2003@gmail.com',
      pass: "kvtm vara qdod ofcu",
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
      }
  });

const Get_Group = async (req,res)=>{
    
    const {_id} = req.id

    try {
        
        const group = await GroupModel.find({admin:_id})
        return res.status(200).json(group)

    } catch (error) {
        res.status(404).json(error)
    }
}

const Create_Group = async (req,res)=>{

    const {_id} = req.id
    const {name,description} = req.body

    try {
        const user = await UsersModel.findById(_id)
        if (user.role==="admin"){
            
            const group = await GroupModel.create({name,description,admin:_id})
            
            return res.status(200).json(group)
        }

        return res.status(400).json({error:"Unuthorized access"})
        
    } catch (error) {
        res.status(500).json({error})
    }
}

const Add_To_Group = async (req,res)=>{

    const {_id} = req.id
    const {id} = req.params

    try {

        const user = await UsersModel.findById(_id)

        if (user && user.role==='user'){

            const group  = await GroupModel.findOneAndUpdate({admin:id},{$addToSet:{members:_id}},{new:true})
            const updated_user = await UsersModel.findOneAndUpdate({_id:_id},{$addToSet:{groups_ID:id}},{new:true})

            return res.status(200).json(group)
        }

        return res.status(404).json({error:"user not found"})
        
    } catch (error) {
        res.status(404).json({error})
    }
}


const Invite_To_Group = async (req,res)=>{

    const {email,gid} = req.body
    const {_id} = req.id

    try {

        const group = await GroupModel.findOne({_id:gid})
        
        if (!group){
            return res.status(404).json({error:"group not found"})
        }

        const user = await UsersModel.findOne({email:email})
        const caller = await UsersModel.findOne({_id})

        if (!user){
            
            const mailOptions = {
                from: process.env.EMAIL_ACCOUNT,
                to: email,
                subject: "Group Invitaion",
                html:`
                    <body style="background:rgb(222, 222, 222); padding: 20px; color:rgb(0, 8, 11);">
                        <h4 style="color:rgb(1, 58, 60)">Group Invitation</h4>
                        <p> <span style="color: rgb(0, 8, 11); font-family: Poppins">${caller.name}</span> has invited you to join the group <span style="color: rgb(0, 8, 11); font-family: Poppins">${group.name}</span></p>
                        <p>But we understand you are not signed up to our platform. So fisrt signup to our platform using this link: </p>
                        <a href="https://ctm-frontend.vercel.app/role" style="background:dodgerblue; text-decoration:none; color:white; font-size:12px; font-family:Poppins; border:none; border-radius:5px; padding: 5px 10px">Sign Up</a> 
                        <p>then use the link below to join the group</p>
                        <a href="https://ctm-frontend.vercel.app/join/${gid}" style="background:dodgerblue; text-decoration:none; color:white; font-size:12px; font-family:Poppins; border:none; border-radius:5px; padding: 5px 10px">Join Group</a></
                        
                    </body>
                    `
              };
              
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) res.status(500).json({error:error});
                else {
                    
                    return res.status(200).json({message:"Invitaion sent to the user"})}
            });

            return res.status(200).json({message:"Invitaion sent to the user"})
        }

        else if (user.role==='user'){

            const mailOptions = {
                from: process.env.EMAIL_ACCOUNT,
                to: email,
                subject: "Group Invitaion",
                html:`
                    <body style="background:rgb(222, 222, 222); padding: 20px; color:rgb(0, 8, 11);">
                        <h4 style="color:rgb(1, 58, 60)">Group Invitation</h4>
                        <p> <span style="color: rgb(0, 8, 11); font-family: Poppins">${caller.name}</span> has invited you to join the group <span style="color: rgb(0, 8, 11); font-family: Poppins">${group.name}</span></p>
                        <p>Please use the link below to join the group</p>
                        <a href="https://ctm-frontend.vercel.app/join/${gid}" style="background:dodgerblue; text-decoration:none; color:white; font-size:12px; font-family:Poppins; border:none; border-radius:5px; padding: 5px 10px">Join Group</a></
                        
                    </body>
                    `
              };
              
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) res.status(500).json({error:error});
                else {
                    
                    return res.status(200).json({message:"Invitaion sent to the user"})}
            });
    
            return res.status(200).json({message:"Invitaion sent to the user"})
        }


        return res.status(404).json({error:'The given user is admin and admins can not be added to groups.'})




        
    } catch (error) {
        console.log(error)
    }
}



const Get_All_Groups = async (req,res)=>{
    
    const {groups_ID} = req.body
    const {_id} = req.id
    let fetched = []


    const user = await UsersModel.findById({_id})

    if (!user){
        return res.status(404).json({error:"user not found"})
    }

    if (user?.role==='admin'){
        const group = await GroupModel.find({admin:_id})
        return res.status(200).json(group)
    }
    
    for (let id in groups_ID){
       
        try {
            const response = await GroupModel.find({admin:groups_ID[id]})
            if (response.length>1){
                fetched = [...fetched,...response]
            }
            else{fetched.push(response)}
            
        } catch (error) {
            console.log(error)
        }
    }

    res.status(200).json(fetched)
}

module.exports = {Create_Group,Get_Group,Add_To_Group,Get_All_Groups,Invite_To_Group}