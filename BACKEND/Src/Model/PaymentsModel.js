const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    userId: {
        type: String,
        required: true, 
    },
    serviceCharge: {
        type: String,
        required: true,
    },   
    allowance: {
        type: String,
        required: true,
    },
    states:{
        type:String,
        default:'true'
    }
},{timestamps:true});

const Payments = mongoose.model('Payments', userSchema);
module.exports = Payments;