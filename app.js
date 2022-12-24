const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const port = 3030;
const userController = require('./controller/userController');
const mongoose = require('mongoose');
const userSchema = require('./model/user.model');
const connection = 'mongodb://localhost:27017/customer_user';
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/user', userController)
mongoose.connect(connection, { useNewUrlParser: true, useUnifiedTopology: true }, function (error, client) {
    if (error) {
        console.log('Error', error);
    } else {
        console.log("MongoDB Connect Successfully")
    }
});


app.listen(port, console.log('server started from ' + port));