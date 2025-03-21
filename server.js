require('dotenv').config()

const express = require('express')
const session = require('express-session')
const mongoose = require('mongoose')
const DB_URI = process.env.MONGO_URI
const taskRouter = require('./routes/routes')
const userRouter = require('./routes/userroutes')
const sessionRouter = require('./routes/session')
const groupRouter = require('./routes/grouproutes')
const passport = require('passport')
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

app.use(session({
    secret: process.env.SECRET, // Keep it secret!
    resave: false, // Prevents unnecessary session updates
    saveUninitialized: false, // Don't save empty sessions
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day expiry
      secure: false, // Set to `true` in production (requires HTTPS)
      httpOnly: true, // Protects against XSS attacks
    },
  }));

app.use(passport.initialize())
app.use(passport.session())

// app.get('/auth',(req,res)=>{
//     res.send('<a href="/auth/google">Sign up with google</a>') 
// })




app.use('/api',taskRouter)
app.use('/api',userRouter)
app.use('/',sessionRouter)
app.use('/group',groupRouter)
