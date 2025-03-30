const mongoose=require('mongoose');

const ETF_EPFSchema=new mongoose.Schema({
    epfNumber:{
        type:String,
        required:true
    },
    etfNumber:{
        type:String,
        required:true
    },
    bankAccount:{
        type:String,
        required:true
    },
    bankName:{
        type:String,
        required:true
    },
    bankBranch:{
        type:String,
        required:true
    },
    nic:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    fulName:{
        type:String,
        required:true
    },
},{timestamps:true});

const ETF_EPF = mongoose.model('ETF_EPF', ETF_EPFSchema);
module.exports = ETF_EPF;