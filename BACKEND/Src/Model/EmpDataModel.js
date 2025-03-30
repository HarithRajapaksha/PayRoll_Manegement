const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true, 
    },
    role: {
        type: String,
        required: true,
    },
    aSal: {
        type: String
    },
    lDays: {
        type: [String],
    }
},{timestamps:true});

const EmpData = mongoose.model('EmpData', userSchema);
module.exports = EmpData;