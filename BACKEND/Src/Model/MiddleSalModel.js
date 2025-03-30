const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
   Uid:{
       type:String,
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
    Salary:{
        type:String,
        required:true
    },
    Status:{
        type:String,
        default:'Non'
    },
    Reason:{
        type:String,
        default:''
    }
},{timestamps:true});

const MiddleSal = mongoose.model('MiddleSal', userSchema);
module.exports = MiddleSal;