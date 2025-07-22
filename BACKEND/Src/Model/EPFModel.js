const mongoose=require('mongoose');

const ETF_Schema=new mongoose.Schema({
    UserId:{
        type:String,
        required:true
    },
    EmployeeId:{
        type:Number,
        required:true
    },
    Employee:{
        type:Number,
        //required:true
    },
     Employer:{
        type:Number,
        //required:true
    }

},{timestamps:true});

const EPFData = mongoose.model('EPFData', ETF_Schema);
module.exports = EPFData;