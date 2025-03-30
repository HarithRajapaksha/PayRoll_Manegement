const User=require('../Model/UserModel');
const jwt=require('jsonwebtoken');


const register=async(req,res)=>{
  try{
    console.log("Request body is : ",req.body);
    const id = `EMP-${Date.now().toString(36)}`;
    const randomEAN = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    
     const{userName,password,role,name,telephone,email,basicSal,nic}=req.body;
     const newUser=new User({name,userName,password,role,barcode:randomEAN,telephone,email,basicSal,nic:nic});
     await newUser.save();
     res.status(201).json({message:'User registered successfully',newUser});

  }catch(err){
      res.status(500).json({message:'User registration failed'+err});
  }
}


const login=async(req,res)=>{
    try{
        const{userName,password}=req.body;
        const userFind=await User.findOne({userName})

        if(!userFind){
            return res.status(404).json({message:`User ${userName} not found`});
        }

        if(userFind.password!==password){
            return res.status(401).json({message:'Password is not correct'});
        }

        const token=jwt.sign({id:userFind._id,role:userFind.role},process.env.JWT_SECRET_KEY,{expiresIn:'1h'});
        res.status(200).json({message:'User logged in successfully',token,userFind});
    }catch(err){
        res.status(500).json({message:'User login failed'});
    }
}

module.exports={
    register,
    login
}