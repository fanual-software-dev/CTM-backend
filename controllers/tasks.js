const mongoose = require('mongoose')
const nodemailer = require('nodemailer')

const tasksModel = require('../models/tasks')
const userModel = require('../models/users')
const GroupModel = require('../models/groups')


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.GOOGLE_PASS,
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
      }
  });

// function to get all the tasks that have been created so far

const Get_All_Tasks = async (req,res)=>{

    const {_id} = req.id
    const {gid} = req.body

    if (!_id || !mongoose.Types.ObjectId.isValid(_id)){
        
        return res.status(400).json({error:"Unauthorized request. Invalid id."})
    }

    const user = await userModel.findOne({_id})

    if (!user){

        return res.status(404).json({error:"No such user found. please try again"})
    }
    
    else if(user.role==='user'){
        try {

            const tasks = await tasksModel.find({assignee:_id,groupID:gid}).sort({createdAt:-1})
            
            return res.status(200).json(tasks) 

        } catch (error) {
            
            return res.status(404).json(error)
        }
    }

    const tasks = await tasksModel.find({groupID:gid}).sort({createdAt:-1})

    if (!tasks){
        return res.status(404).json({error:"Opps tasks not found"})
    }

    return res.status(200).json(tasks)
}

// function to get a single task by it's id

const Get_Single_Task = async (req,res)=>{
    
    const {id} = req.params
    const {_id} = req.id
    const { gid } = req.body

    if (!_id || !mongoose.Types.ObjectId.isValid(_id) || !mongoose.Types.ObjectId.isValid(id)){
        
        return res.status(400).json({error:"Unauthorized request. Invalid id."})
    }

    const user = await userModel.findOne({_id})

    if (!user){

        return res.status(404).json({error:"No such user found. please try again"})
    }
    
    else if(user.role==='user'){
        try {

            const tasks = await tasksModel.find({_id:id, assignee:_id,groupID:gid})
            
            return res.status(200).json(tasks) 

        } catch (error) {
            
            return res.status(404).json(error)
        }
    }

    const task = await tasksModel.findOne({_id:id,groupID:_id})

    if (!task){
        return res.status(404).json({error:"Opps can't find the specified tasks"})
    }

    return res.status(200).json(task)
}

// function to create a task

const Create_Task = async (req,res)=>{

    const { title,description,dueDate,assignee,status,priority,tags,comments,attachements,createdBy,createdAt,updatedAt } = req.body
    const {_id} = req.id
    const {gid} = req.body

    if (!_id || !mongoose.Types.ObjectId.isValid(_id)){
        
        return res.status(400).json({error:"Unauthorized request. Invalid id."})
    }


    const user = await userModel.findOne({_id})

    if (!user || user.role==='user'){

        return res.status(404).json({error:"No such user found or unauthorized access. please try again"})
    }

    const group = await GroupModel.findOne({admin:_id})

    if (!group){
        return res.status(404).json({error:"Group not found by this ID."})
    }

    if ( assignee && !group.members.includes(assignee)){
        return res.status(404).json({error:"Assigned user not member of the group"})
    }

    try{
        
        const task = await tasksModel.create({ title,description,dueDate,assignee,status,priority,tags,comments,attachements,createdBy,createdAt,updatedAt,groupID:group._id })
        
        if (assignee){

            const assigned_member = await userModel.findById(assignee)
            
            const mailOptions = {
                from: process.env.EMAIL_ACCOUNT,
                to: assigned_member.email,
                subject: "Task Assigning",
                html:`
                    <body style="background-color: #f4f4f4; padding: 20px;">
                        <h1 style="color:rgb(0, 55, 56);">Task Assigning</h1>
                        <p>Hello, <b>${assigned_member.name}</b></p>
                        <p> you have assigned some new task by ${user.name}. </p>
                        <p><b>title </b>${task.title} and <b>priority :</b> ${task.priority}</p>
                    </body>
                    `
              };
              
              transporter.sendMail(mailOptions, (error, info) => {
                if (error) res.status(500).json({error:error});
                else {
                    
                    return res.status(200).json(task)}
              });
        }
        
        
        

        return res.status(200).json(task)
    }

    catch (error) {
        return res.status(505).json({error: error.message})
    }


}

const Update_Task = async (req,res)=>{
    
    const {_id} = req.id
    const {comments,status,attachements} = req.body
    const {id} = req.params

    try {
        
        const user = await userModel.findOne({_id})

        if (!user){
            
            return res.status(404).json({error:"No such user found"})
        }

        else if (user.role=='user'){

            const task = await tasksModel.findOneAndUpdate({_id:id,assignee:_id},{comments,status,attachements})
            
            if (task){

                return res.status(200).json(task)
            }

            return res.status(500).json({error:"Error occur while updating the task"})
        }

        console.log(req.body)

        const task = await tasksModel.findOneAndUpdate({_id:id},{...req.body})

        return res.status(200).json(task)

    } catch (error) {

        console.log(error)
        
        res.status(400).json({error:error})
    }
}

const Delete_Task = async (req,res)=>{
    
    const {_id} = req.id
    const {id} = req.params

    try {
        
        const user = await userModel.findById(_id)

        if (user.role==='admin'){
            
            const task = await tasksModel.findOneAndDelete({_id:id})
            
            if (task){

                return res.status(200).json(task)
            }
            
            return res.status(500).json({error:"Error occured while deleting the task"})
        }

        return res.status(400).json({error:"Bad request. Unauthorized request."})
    } catch (error) {
     
        return res.status(400).json({error:error})   
    }
}


module.exports = {Get_All_Tasks,Get_Single_Task,Create_Task,Update_Task,Delete_Task}