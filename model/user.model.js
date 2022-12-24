const mongoose = require('mongoose');
const Schema = require('mongoose');
const userSchema = new mongoose.Schema({
    name:  {
        type: "string",
        required: true,
    },
    email:  {
        type: "string",
        required: true,
    },
    userId:  {
        type: "string",
        required: true,
    },
    phoneNo:  {
        type: "number",
        required: true,
    },
    address:  {
        type: "string",
        required: false,
    },
    userRole:  {
        type: "string",
        required: true,
    },
    password:  {
        type: "string",
        required: true,
    },
})
module.exports = userSchema;
module.exports = mongoose.model(
    'user', userSchema, 'user'); 
