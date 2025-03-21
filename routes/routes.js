const express = require('express')

const router = express.Router()

const {Get_All_Tasks,Get_Single_Task,Create_Task,Update_Task,Delete_Task} = require('../controllers/tasks')

const AuthMiddleware = require('../middleware/Auth')

router.use(AuthMiddleware)

// Get all tasks for manager

router.post('/tasks',Get_All_Tasks)

// Get a single task for manager

router.post('/task/:id',Get_Single_Task)

// Create a task

router.post('/create-task',Create_Task)

// Update task

router.patch('/update-task/:id',Update_Task)

// Delete a task

router.delete('/delete-task/:id',Delete_Task)

module.exports = router