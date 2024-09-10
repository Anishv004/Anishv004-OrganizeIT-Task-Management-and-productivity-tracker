const dotenv = require('dotenv')
dotenv.config({path: './config.env'})

const mongoose = require('mongoose')

const app = require('./app') 

mongoose.connect(process.env.CONN_STR, {
    useNewUrlParser: true
}).then((conn) => {
    console.log("DB Connected Successfully");
}).catch((error) => {
    console.log("Some error occurred");
})

    

// Create a server
let port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log("Server has started");
})