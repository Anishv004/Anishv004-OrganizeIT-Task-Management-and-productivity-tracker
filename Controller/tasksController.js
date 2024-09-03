const Tasks = require('../Model/tasksModel');

exports.addNewTask = async (req, res) => {
    try{
        const tasks = await Tasks.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                tasks: tasks
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }
} 

exports.getAllTasks = async (req, res) => {
    try{
        const tasks = await Tasks.find();

        res.status(200).json({
            status: 'success',
            data: {
                tasks: tasks
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }
}

exports.updateTask = async (req, res) => {
    try{
        const tasks = await Tasks.findByIdAndUpdate(req.params.id, req.body, { 
            new: true, runValidators: true 
        });

        res.status(200).json({
            status: 'success',
            data: {
                tasks
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }
}

exports.updateProgressStatus = async (req, res) => {
    try{
        const tasks = await Tasks.findByIdAndUpdate(req.params.id, req.progress, { 
            new: true, runValidators: true 
        });

        res.status(200).json({
            status: 'success',
            data: {
                tasks
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }
}

exports.deleteTask = async (req, res) => {
    try {
        const task = await Tasks.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }
}

const calculateTimeLeft = (deadline) => {
    let timeDifference = deadline - Date.now();

    let days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    let hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

    return `${days} days, ${hours} hours, and ${minutes} minutes left`;
};

exports.getTimeLeft = async (req, res) => {
    try{
        let deadline = await Tasks.findById(req.params.id);

        res.status(200).json({
            status: 'success',
            data: {
                timeLeft: calculateTimeLeft(deadline.deadline)
            }
        })
    } catch(err){
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }
}

exports.getMonthlySchedule = async (req, res) => {

    try {
        const { month, year } = req.query;

        if (!month || !year) {
            return res.status(400).json({
                status: 'fail',
                message: 'Month and year are required'
            });
        }

        const monthNumber = parseInt(month, 10);
        const yearNumber = parseInt(year, 10);

        if (isNaN(monthNumber) || isNaN(yearNumber) || monthNumber < 1 || monthNumber > 12) {
            return res.status(400).json({
                status: 'fail',
                message: 'Invalid month or year'
            });
        }

        let daysInMonth = new Date(yearNumber, monthNumber, 0).getDate();
        let schedule = {};

        for (let i = 1; i <= daysInMonth; i++) {
            let day = i < 10 ? `0${i}` : i;
            let startOfDay = new Date(yearNumber, monthNumber - 1, i, 0, 0, 0);
            let endOfDay = new Date(yearNumber, monthNumber - 1, i, 23, 59, 59);

            let tasks = await Tasks.find({
                deadline: {
                    $gte: startOfDay,
                    $lte: endOfDay
                }
            });

            schedule[`${yearNumber}-${monthNumber}-${day}`] = tasks;
        }

        res.status(200).json({
            status: 'success',
            year: yearNumber,
            month: monthNumber,
            data: schedule
        });

    } catch (err) {
        console.error('Error:', err);
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }
};

// Retrieves the tasks with deadline on the current day
exports.getCurrentDayPlan = async (req, res) => {
    try {
        const { day, month, year } = req.query;

        if (!day || !month || !year) {
            return res.status(400).json({
                status: 'fail',
                message: 'Day, Month and year are required'
            });
        }

        const dayNumber = parseInt(day, 10);
        const monthNumber = parseInt(month, 10);
        const yearNumber = parseInt(year, 10);

        let daysInMonth = new Date(yearNumber, monthNumber, 0).getDate();

        if (isNaN(dayNumber) || isNaN(monthNumber) || isNaN(yearNumber) || dayNumber < 1 || dayNumber > daysInMonth || monthNumber < 1 || monthNumber > 12) {
            return res.status(400).json({
                status: 'fail',
                message: 'Invalid day, month or year'
            });
        }

        let startOfDay = new Date(yearNumber, monthNumber - 1, dayNumber, 0, 0, 0);
        let endOfDay = new Date(yearNumber, monthNumber - 1, dayNumber, 23, 59, 59);

        
        // Retrieve all tasks for the given day that are not "Completed"
        let tasks = await Tasks.find({
            deadline: {
                $gte: startOfDay,
                $lte: endOfDay
            },
            progress: { $ne: "Completed" } 
        });

        let schedule = tasks.map(task => {
           return {
                ...task.toObject(), // Convert Mongoose document to plain object
                timeLeft: calculateTimeLeft(task.deadline)
            };
        });


        res.status(200).json({
            status: 'success',
            year: yearNumber,
            month: monthNumber,
            data: {
                todayDeadlines: schedule
            }
        });

    } catch (err) {
        console.error('Error:', err);
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }
}

// get all the upcoming and missed out dues before 30 days to after 30 days from now
exports.getAllDues = async (req, res) => {
    try {
        const currentDate = new Date();
        
        // Calculate 30 days before and after the current date
        const thirtyDaysBefore = new Date(currentDate.getTime() - (30 * 24 * 60 * 60 * 1000));
        const thirtyDaysAfter = new Date(currentDate.getTime() + (30 * 24 * 60 * 60 * 1000));

        const tasks = await Tasks.find({
            deadline: {
                $gte: thirtyDaysBefore,
                $lte: thirtyDaysAfter
            },
            progress: { $ne: "Completed" }
        }).sort({ deadline: 1 });

        res.status(200).json({
            status: 'success',
            data: {
                tasks: tasks
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }
}

exports.getAllOngoing = async (req, res) => {
    try{
        const tasks = await Tasks.find({
            progress: "Ongoing"
        }).sort({deadline : 1});

        res.status(200).json({
            status: 'success',
            data: {
                tasks: tasks
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }
}