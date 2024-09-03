const express = require('express');
const tasksController = require('../Controller/tasksController');

const route = express.Router();

route.route('/')
    .get(tasksController.getAllTasks)
    .post(tasksController.addNewTask)

route.route('/dues')
    .get(tasksController.getAllDues)

route.route('/ongoing')
    .get(tasksController.getAllOngoing)

route.route('/monthlySchedule')
    .get(tasksController.getCurrentDayPlan)
    .get(tasksController.getMonthlySchedule)
    
route.route('/:id')
    .get(tasksController.getTimeLeft)
    .patch(tasksController.updateTask)
    .patch(tasksController.updateProgressStatus)
//     .delete(tasksController.deleteTask)



module.exports = route;