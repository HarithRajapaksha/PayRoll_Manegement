const mongoose = require('mongoose');

const LastEmpIdSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true, 
    }
},{timestamps:true});

const EmpIdData = mongoose.model('EmpIdData',LastEmpIdSchema);
module.exports = EmpIdData;