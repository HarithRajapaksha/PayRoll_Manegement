const mongoose=require('mongoose');

const HalfDayShema=new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    whichHalf:{
        type:String,
        required:true
    },
    reason:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:'Non'
    }
},{timestamps:true});

const HalfDayData = mongoose.model('HalfDay',HalfDayShema);
module.exports = HalfDayData;