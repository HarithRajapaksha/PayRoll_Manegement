const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true, 
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ['Admin', 'Maneger', 'Headchef','Subchef','Supervisior','Waiter','Helper'],
    },
    barcode: {
        type: String,
        unique: true,
        //required: true,
    },
    image: {
        type: String,
        //required: true,
    },
    telephone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    basicSal: {
        type: String,
        required: true,
    },
    nic: {
        type: String,
        required: true,
    },
},{timestamps:true});

const User = mongoose.model('User', userSchema);
module.exports = User;