const express = require('express')

const router = express.Router()

const {Get_All_Users,Get_Single_User,Create_User,Edit_User} = require('../controllers/users')

const Auth = require('../middleware/Auth')

router.use(Auth)

// get all users

router.get('/users',Get_All_Users)

// get single user

router.get('/user/:id',Get_Single_User)

// create a user

router.post('/create-user/:id',Create_User)

router.patch('/edit-user',Edit_User)

//trying to check git configuration

module.exports = router