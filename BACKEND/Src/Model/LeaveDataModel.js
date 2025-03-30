const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({

    LeaveHolderId:{
        type:String,
        required:true
    },
   LeaveStartDate:{
       type:Date,
       required:true
   },
   LeaveEndDate:{
       type:Date,
       required:true
   },
   NumOfDay:{
       type:Number,
       required:true
   },
   Name:{
       type:String,
       required:true
   },
    Role:{
         type:String,
         required:true
    },
    Reason:{
        type:String,
        required:true
    },
    status:{
        type:String,
    },
    declineReason:{
        type:String,
    }
},{timestamps:true});

const Leave = mongoose.model('leave', leaveSchema);
module.exports = Leave;