const express = require('express')

const router = express.Router()

const {User_Sign_Up,User_Log_In} = require('../controllers/session')
const {Google_Log_In,Google_Sign_Up} = require('../controllers/google')

// user sign up

router.post('/signup',User_Sign_Up)

// use log in

router.post('/login',User_Log_In)

router.post('/google/login',Google_Log_In)

router.post('/google/signup',Google_Sign_Up)

module.exports = router