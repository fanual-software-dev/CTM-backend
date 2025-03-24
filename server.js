require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const DB_URI = process.env.MONGO_URI
const taskRouter = require('./routes/routes')
const userRouter = require('./routes/userroutes')
const sessionRouter = require('./routes/session')
const groupRouter = require('./routes/grouproutes')
const cors = require('cors')
const app = express()


mongoose.connect(DB_URI)
    .then(()=>{
        app.listen(process.env.PORT,()=>{
            console.log(`Connected to DB && listening to port`,process.env.PORT)
        })
    })

    .catch((Error)=>{
        console.log(Error,"Here is the error")
    })

app.use((req,res,next)=>{
    console.log(req.method,req.path)
    next()
});

app.use(express.json());

app.use(cors())





// app.get('/auth',(req,res)=>{
//     res.send('<a href="/auth/google">Sign up with google</a>') 
// })




app.use('/api',taskRouter)
app.use('/api',userRouter)
app.use('/',sessionRouter)
app.use('/group',groupRouter)
