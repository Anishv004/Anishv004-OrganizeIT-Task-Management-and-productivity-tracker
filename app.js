const express = require('express');
const tasksRouter = require('./Routes/tasksRoutes')
const tagsRouter = require('./Routes/tagsRoutes')

let app = express();

app.use(express.json())

app.use('/tasks', tasksRouter)
app.use('/tags', tagsRouter)

module.exports = app;



