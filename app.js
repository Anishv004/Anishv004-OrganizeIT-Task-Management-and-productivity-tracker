const express = require('express');
const tasksRouter = require('./Routes/tasksRoutes')

let app = express();

app.use(express.json())

app.use('/tasks', tasksRouter)

module.exports = app;



