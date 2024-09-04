const mongoose = require('mongoose');

const tasksSchema = new mongoose.Schema({
    title: { 
        type: String,
        required: [true, 'Title is mandatory'],
        trim: true 
    },
    description: { 
        type: String,
        trim: true 
    },
    dateCreated: { 
        type: Date, 
        default: Date.now 
    },
    deadline: { 
        type: Date, 
        required: [true, 'Deadline is mandatory'] 
    },
    tentativeCompletionDate: { 
        type: Date, 
        required: [true, 'Please add a tentative deadline'] 
    },
    remarks: { 
        type: String,
        trim: true 
    },
    tags: { 
        type: String,
        default: 'Unknown' 
    },
    progress: {
        type: String,
        default: "Yet to Start"
    },
    recurring: {
        type: Number,
        default: 0
    },
    repeatAfter: {
        // No. of days
        type: Number
    },
    repeatEveryWeek: {
        // Day number of week (0-6)
        type: Number
    },
    repeatEveryMonth: {
        // Date
        type: Number
    },
    numberOfIterations: {
        type: Number
    }
});

const Tasks = new mongoose.model("Tasks", tasksSchema);
module.exports = Tasks;