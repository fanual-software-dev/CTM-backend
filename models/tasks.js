const mongoose = require('mongoose')

const Schema = mongoose.Schema

const tasksModel = new Schema({
    title: { type: String, required: true },
    description: { type: String, required:true},
    dueDate: { type: Date },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    status: { type: String, enum: ['To Do', 'In Progress', 'Done'], default: 'To Do' },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
    tags: { type: [String] },
    comments: { type: [String] },
    attachments: { type: [String] },
    groupID: { type: mongoose.Schema.Types.ObjectId, ref: 'group' ,required:true},
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }



},{timestamps:true})

module.exports = mongoose.model('task',tasksModel)