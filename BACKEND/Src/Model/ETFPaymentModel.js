const mongoose=require('mongoose');

const HalfDayShema=new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    Month:{
        type:Number,
        required:true
    },
    Year:{
        type:String,
        required:true
    },
    EMPID:{
        type:Number,
        required:true
    },
    Value:{
        type:Number,
        required:true
    }
},{timestamps:true});

const ETFPayment= mongoose.model('ETFPayment',HalfDayShema);
module.exports = ETFPayment;