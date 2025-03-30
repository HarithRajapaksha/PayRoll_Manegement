const express=require('express');
const router=express.Router();
const authorizeRoles=require("../Middlewares/roleMiddleware");
const verifyToken=require("../Middlewares/authMiddleware");
const User = require('../Model/UserModel');
const LeaveData= require('../Model/LeaveDataModel');
const MiddleSal= require('../Model/MiddleSalModel');
const Attendance=require('../Model/AttendenceData');
const EPF_EPF=require('../Model/ETF_EPFModel');
const HalfDay=require('../Model/HalfDayModel');
const Allowance=require('../Model/Allowancemodel');
const Payments=require('../Model/PaymentsModel');
const allowance = require('../Model/Allowancemodel');



//Only admin can access this route
router.get('/admin/:userId',verifyToken,authorizeRoles('Maneger', 'Headchef','Subchef','Supervisior','Waiter','Helper','Admin'),async(req,res)=>{

        const userId=req.params.userId;
        console.log("User Id is : ",userId);
       try {
        const FindUser= await User.findById(userId).lean();
        res.status(200).json({message:'User found',FindUser});
        console.log("User finded ",FindUser);
       } catch (error) {
         res.status(500).json({message:'User not found'});
         console.log("Error is : ",error);
       }
    
});

//Only manager can access this route
router.get('/manager',verifyToken,authorizeRoles('maneger'),(req,res)=>{
    res.send('Welcome Manager');
});

//All users can access this route
router.get('/allUsers/:id',verifyToken,authorizeRoles('Maneger', 'Headchef','Subchef','Supervisior','Waiter','Helper'),async(req,res)=>{

  const id=req.params.id;
  console.log("User Id is : ",id);

  try {
    const FindUser= await User.findById(id).lean();
    res.status(200).json({message:'User found',FindUser});
    console.log("User finded ",FindUser);
   } catch (error) {
     res.status(500).json({message:'User not found'});
     console.log("Error is : ",error);
   }
});



//Get all users data
router.get('/allUsersData',verifyToken,authorizeRoles('Maneger','Admin', 'Headchef','Subchef','Supervisior','Waiter','Helper'),async(req,res)=>{


  try {
    const FindUser= await User.find().lean();
    res.status(200).json({message:'User found',FindUser});
    console.log("User finded ",FindUser);
   } catch (error) {
     res.status(500).json({message:'User not found'});
     console.log("Error is : ",error);
   }
});



//All users can access this route
router.post('/addEmpData',verifyToken,authorizeRoles('Maneger', 'Headchef','Subchef','Supervisior','Waiter','Helper'),async(req,res)=>{
   const {userId,role,aSal,lDays}=req.body;

    const newUser=new LeaveData({
        userId,
        role,
        aSal,
        lDays
    });

    try {
        const user=await newUser.save();
        res.status(200).json({message:'User added',user});
        console.log("User added ",user);
    } catch (error) {
        res.status(500).json({message:'User not added'});
        console.log("Error is : ",error);
    }
  
});


//All users can access this route
router.post('/addLeave',verifyToken,authorizeRoles('Maneger', 'Headchef','Subchef','Supervisior','Waiter','Helper'),async(req,res)=>{
  const {LeaveHolderId, LeaveStartDate,
    LeaveEndDate,
    NumOfDay ,
    Name,
    Role,
    Reason,Status}=req.body;

   const newLeave=new LeaveData({
    LeaveHolderId,
    LeaveStartDate:LeaveStartDate,
    LeaveEndDate,
    NumOfDay ,
    Name,
    Role,
    Reason,
    Status
   });

   console.log("Leave data is : ",newLeave);

   try {
       const leave=await newLeave.save();
       res.status(200).json({message:'Leave added',leave });
       console.log("Leave added ",leave);
   } catch (error) {
       res.status(500).json({message:'Leave not added'});
       console.log("leave added error: ",error);
   }
 
});


//All users can access this route
router.post('/salRequest',verifyToken,authorizeRoles('Maneger', 'Headchef','Subchef','Supervisior','Waiter','Helper'),async(req,res)=>{
  const {Uid,Name,Role,Salary}=req.body;

   const newUser=new MiddleSal({ 
      Uid,
      Name,
      Role,
      Salary
   });

   try {
       const user=await newUser.save();
       res.status(200).json({message:'MiddleSal added',user});
       console.log("Middle Salary Added",user);
   } catch (error) {
       res.status(500).json({message:'Middle Salary Not Added'});
       console.log("Middle Salary Not Added",error);
   }
 
});


router.get('/HolidayData', verifyToken, authorizeRoles('Admin','Maneger', 'Headchef','Subchef','Supervisior','Waiter','Helper'), async (req, res) => {
  try {
    
    const HolidayData = await LeaveData.find().sort({ LeaveStartDate: -1 });
    res.status(200).json(HolidayData);
    console.log("Holiday data found:", HolidayData);
  } catch (error) {
    res.status(500).json({ message: 'Holiday data not found' });
    console.log("Holiday data not found", error);
  }
});


router.get('/getHolidayData/:id',verifyToken,authorizeRoles('Admin', 'Maneger', 'Headchef', 'Subchef', 'Supervisior', 'Waiter', 'Helper'),
  async (req, res) => {
    try {
      const { id } = req.params;

      // Get current month range
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      // Fetch leaves for that user in the current month
      const leaveData = await LeaveData.find({
        LeaveHolderId: id,
        LeaveStartDate: { $gte: startOfMonth, $lte: endOfMonth },status:"true"
      }).select('NumOfDay');

      // Sum up the total leave days for this month
      const totalDays = leaveData.reduce((sum, leave) => sum + (leave.NumOfDay || 0), 0);

      const isLessThanSeven = totalDays < 7;

      res.status(200).json({ allowed: isLessThanSeven, totalDays });
    } catch (err) {
      console.error("Error fetching leave data:", err);
      res.status(500).json({ message: 'Holiday data not found' });
    }
  }
);


router.put('/updateLeave', verifyToken, authorizeRoles('Admin','Maneger', 'Headchef','Subchef','Supervisior','Waiter','Helper'), async (req, res) => {
  try {
    
    const { id, status,declineReason} = req.body;

    console.log("Leave Holder Id is: ", id);
    console.log("Status is: ", status);
    console.log("Decline Reason is: ", declineReason);

    const HolidayUpdate = await LeaveData.findOneAndUpdate(
      { _id: id }, 
      { $set: { status: status,declineReason:declineReason} }, 
      { new: true } 
    );

    if (!HolidayUpdate) {
      return res.status(404).json({ message: 'Leave not found' });
    }

    res.status(200).json({ message: 'Leave updated successfully', HolidayUpdate });
    console.log("Leave updated:", HolidayUpdate);

  } catch (err) {
    res.status(500).json({ message: 'Leave not updated' });
    console.log("Leave not updated", err);
  }
});

router.get('/AllLeaveData', verifyToken, authorizeRoles('Admin','Maneger', 'Headchef','Subchef','Supervisior','Waiter','Helper'), async (req, res) => {
  try {
    
    const MSalData = await MiddleSal.find();
    res.status(200).json(MSalData);
    console.log("Midle salary data found:", MSalData);
  } catch (error) {
    res.status(500).json({ message: 'Leave data not found' });
    console.log("Midle salary data not found", error);
  }
});

router.post('/AddAdditionalSal', verifyToken, authorizeRoles('Admin','Maneger', 'Headchef','Subchef','Supervisior','Waiter','Helper'), async (req, res) => {
  const {Uid,Name,Role,Salary}=req.body;

   const newUser=new MiddleSal({ 
      Uid,
      Name,
      Role,
      Salary,
      Status:'Non',
      Reason:''
   });

   try {
       const user=await newUser.save();
       res.status(200).json({message:'MiddleSal added',user});
       console.log("Middle Salary Added",user);
   } catch (error) {
       res.status(500).json({message:'Middle Salary Not Added'});
       console.log("Middle Salary Not Added",error);
   }
});

//Status and Reason Update route in Middle Salary
router.put('/updateMiddleSal', verifyToken, authorizeRoles('Admin','Maneger', 'Headchef','Subchef','Supervisior','Waiter','Helper'), async (req, res) => {
  try {
    
    const { id, Status,Reason} = req.body;

    console.log("User Id is: ", id);
    console.log("Status is: ", Status);
    console.log("Reason is: ", Reason);

    const SalUpdate = await MiddleSal.findOneAndUpdate(
      { _id: id }, 
      { $set: { Status: Status,Reason:Reason} }, 
      { new: true } 
    );

    if (!SalUpdate) {
      return res.status(404).json({ message: 'Salary not found' });
    }

    res.status(200).json({ message: 'Salary updated successfully', SalUpdate });
    console.log("Salary updated:", SalUpdate);

  } catch (err) {
    res.status(500).json({ message: 'Salary not updated' });
    console.log("Salary not updated", err);
  }
});


//get user data by barcode 
router.get('/getUser/:barcode',verifyToken,authorizeRoles('Admin','Maneger', 'Headchef','Subchef','Supervisior','Waiter','Helper'),async(req,res)=>{

  const barcode=req.params.barcode;
  console.log("Barcode is : ",barcode);

  try {
    const FindUser= await User.findOne({barcode}).lean();
    res.status(200).json({message:'User found',FindUser});
   } catch (error) {
     res.status(500).json({message:'User not found'});
     console.log("Error is : ",error);
   }
});


//Add the attendence data
router.put('/updateUserAttendence',verifyToken,authorizeRoles('Admin','Maneger', 'Headchef','Subchef','Supervisior','Waiter','Helper'),async(req,res)=>{  
  const {userId,name,jobrole,barcode,date,time,status}=req.body;

  try {
    const user=await User.findOneAndUpdate({_id:userId},{name,jobrole,barcode,date,time,status},{new:true});
    if(!user){
      return res.status(404).json({message:'User not found for update'});
    }
    res.status(200).json({message:'User updated',user});
    console.log("User updated ",user);
  } catch (error) {
    res.status(500).json({message:'User not updated'});
    console.log("Error is : ",error);
  }
});

router.post('/addUserAttendence',verifyToken,authorizeRoles('Admin','Maneger', 'Headchef','Subchef','Supervisior','Waiter','Helper'),async(req,res)=>{
  const {userId,name,date,time}=req.body;

  const newAttendence=new Attendance({
      userId,
      name,
      date,
      time,
  });
  console.log("Attendence data is : ",newAttendence);

  try {
      const user=await newAttendence.save();
      res.status(200).json({message:'Attendence data added',user});
      console.log("User added ",user);
  } catch (error) {
      res.status(500).json({message:'Attendence data not added'});
      console.log("Error is : ",error);
  }

});


router.post('/addEPF_EPF',verifyToken,authorizeRoles('Admin','Maneger', 'Headchef','Subchef','Supervisior','Waiter','Helper'),async(req,res)=>{
  const {  epfNumber,
    etfNumber,
    bankAccount,
    bankName,
    bankBranch,
    nic,
    address,
    fullName}=req.body;

  const newEPF_EPF=new EPF_EPF({
    epfNumber:epfNumber,
    etfNumber:etfNumber,
    bankAccount:bankAccount,
    bankName:bankName,
    bankBranch:bankBranch,
    nic:nic,
    address:address,
    fulName:fullName
  });

  try {
      const user=await newEPF_EPF.save();
      res.status(200).json({message:'EPF_EPF data added',user});
      console.log("User added ",user);
  } catch (error) {
      res.status(500).json({message:'EPF_EPF data not added'});
      console.log("Error is : ",error);
  }

});

router.post('/addHalfDay',verifyToken,authorizeRoles('Admin','Maneger', 'Headchef','Subchef','Supervisior','Waiter','Helper'),async(req,res)=>{
  const {userId,date,whichHalf,reason}=req.body;

  const halfDayData=new HalfDay({
      userId,
      date,
      whichHalf,
      reason
  });

  try {
      const user=await halfDayData.save();
      res.status(200).json({message:'HalfDay data added',user});
      console.log("User added ",user);
  } catch (error) {
      res.status(500).json({message:'HalfDay data not added'});
      console.log("Error is : ",error);
  }
});



router.get('/getSalData/:id/:year/:month', verifyToken, authorizeRoles(
  'Admin', 'Maneger', 'Headchef', 'Subchef', 'Supervisior', 'Waiter', 'Helper'
), async (req, res) => {
  const { id, year, month } = req.params;
  console.log("User ID:", id, "Year:", year, "Month:", month);

  try {
    const yearInt = parseInt(year, 10);
    const monthInt = parseInt(month, 10);

    const startDate = new Date(yearInt, monthInt - 1, 1);
    const endDate = new Date(yearInt, monthInt, 1);
    const numberOfDays = (endDate - startDate) / (1000 * 3600 * 24);

    // ✅ Get user basic info
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const basicSalData = user.basicSal;
    const UserId = user._id;
    const Name = user.name;

    // ✅ Get payments (allowance & service charge)
    const AllowanceAndServiceCharges = await Payments.find({
      createdAt: { $gte: startDate, $lt: endDate },
      userId: id
    });

    const allowance = AllowanceAndServiceCharges[0]?.allowance || 0;
    const serviceCharge = AllowanceAndServiceCharges[0]?.serviceCharge || 0;

    // ✅ Get other data
    const HalfSalData = await MiddleSal.find({
      createdAt: { $gte: startDate, $lt: endDate },
      Uid: id
    });

    const HalfDayData = await HalfDay.find({ 
      createdAt: { $gte: startDate, $lt: endDate },
      userId: id, 
    });

    const AttendanceData = await Attendance.find({ 
      createdAt: { $gte: startDate, $lt: endDate },
      userId: id,  
    });

    const LeaveData1 = await LeaveData.find({
      createdAt: { $gte: startDate, $lt: endDate },
      LeaveHolderId: id,
    });

    // ✅ Summaries
    const leaveStatus = LeaveData1?.map(record => record.Status);
    const approvedLeaveDays = leaveStatus?.filter(status => status === 'true').length || 0;

    const attendanceStatus = AttendanceData?.map(record => record.status);
    const presentDays = attendanceStatus?.filter(status => status === 'Present').length || 0;
    const halfDayAbsences = attendanceStatus?.filter(status => status === 'HalfDay').length || 0;

    const halfDayStatuses = HalfDayData?.map(record => record.status);
    const halfDayTrue = halfDayStatuses?.filter(status => status === 'true').length || 0;
    const halfDayFalse = halfDayStatuses?.filter(status => status === 'false').length || 0;

    // ✅ Calculations
    const PerDaySal = basicSalData / numberOfDays;
    const halfDaySalary = halfDayTrue * PerDaySal;

    const AcceptedHalfSal = HalfSalData?.reduce((sum, item) => sum + item.Salary, 0) || 0;

    const EPF = basicSalData * 0.08;
    const ETF = basicSalData * 0.03;

    const totalWorkedDays = presentDays + approvedLeaveDays + halfDayAbsences;
    const noPayDays = numberOfDays - totalWorkedDays;
    const NoPaySalary = noPayDays * PerDaySal;

    const TotalSalary =
      basicSalData
      - EPF
      - halfDaySalary
      - NoPaySalary
      - AcceptedHalfSal
      + Number(allowance)
      + Number(serviceCharge);

    // ✅ Final response
    res.status(200).json({
      UserId,
      name: Name,
      year: yearInt,
      month: monthInt,
      NetSalary: Number(TotalSalary),
      NoPay: Number(NoPaySalary),
      BasicSal: Number(basicSalData),
      ETF: Number(ETF),
      EPF: Number(EPF),
      NumberOfHalfDays: halfDayTrue + halfDayAbsences,
      NoPayDays: noPayDays,
      allowance: Number(allowance),
      serviceCharge: Number(serviceCharge)
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
});


//Get only this month Attendence data
router.get('/getUserAttendence/:year/:month', verifyToken, authorizeRoles('Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor', 'Waiter', 'Helper'), async (req, res) => {
  const { year, month } = req.params;

  try {
    // Convert year and month to integers
    const yearInt = parseInt(year, 10);
    const monthInt = parseInt(month, 10);

    if (isNaN(yearInt) || isNaN(monthInt) || monthInt < 1 || monthInt > 12) {
      return res.status(400).json({ message: 'Invalid year or month' });
    }

    // Calculate start and end of the month
    const startDate = new Date(yearInt, monthInt - 1, 1); // First day of the month
    const endDate = new Date(yearInt, monthInt, 1); // First day of next month

    // Step 1: Aggregate attendance data and count 'Present' and 'HalfDay' statuses for each user
    const userAttendance = await Attendance.aggregate([
      { $match: { createdAt: { $gte: startDate, $lt: endDate } } },
      { 
        $group: {
          _id: "$userId", 
          presentCount: { 
            $sum: { $cond: [{ $eq: ["$status", "Present"] }, 1, 0] } 
          },
          halfDayCount: { 
            $sum: { $cond: [{ $eq: ["$status", "HalfDay"] }, 1, 0] } 
          }
        }
      },
      {
        // Combine the present and half-day counts
        $addFields: {
          totalAttendance: { $add: ["$presentCount", "$halfDayCount"] }
        }
      },
      { 
        // Sort by the total attendance count in ascending order (lowest first)
        $sort: { totalAttendance: 1 }
      }
    ]);

    // Check if userAttendance has results
    if (userAttendance.length === 0) {
      return res.status(404).json({ message: 'No attendance data found for the given month' });
    }

    // Debugging the raw aggregation result
    console.log("Aggregated User Attendance:", userAttendance);

    // Step 2: Get the highest and lowest attendance users
    const lowestAttendanceUser = userAttendance[0]; // User with the lowest total attendance
    const highestAttendanceUser = userAttendance[userAttendance.length - 1]; // User with the highest total attendance

    // Debugging the highest and lowest attendance users
    console.log("Highest Attendance User:", highestAttendanceUser);
    console.log("Lowest Attendance User:", lowestAttendanceUser);

    // Step 3: Fetch user details for the highest and lowest attendance users
    const highestUserDetails = await User.findById(highestAttendanceUser._id);
    const lowestUserDetails = await User.findById(lowestAttendanceUser._id);

    if (!highestUserDetails || !lowestUserDetails) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Step 4: Return the response with the highest and lowest attendance users and their counts
    res.status(200).json({
      highestUserDetails: { 
        name: highestUserDetails.name, 
        totalAttendance: highestAttendanceUser.totalAttendance,
        presentCount: highestAttendanceUser.presentCount,
        halfDayCount: highestAttendanceUser.halfDayCount
      },
      lowestUserDetails: { 
        name: lowestUserDetails.name, 
        totalAttendance: lowestAttendanceUser.totalAttendance,
        presentCount: lowestAttendanceUser.presentCount,
        halfDayCount: lowestAttendanceUser.halfDayCount
      }
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//get the lowest and highest NoPay data
router.get('/getSalHighestAndLovestSal/:year/:month', verifyToken, authorizeRoles(
  'Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor', 'Waiter', 'Helper'
), async (req, res) => {
  const { year, month } = req.params;
  console.log("Year:", year, "Month:", month);

  try {
    // Convert year and month to integers
    const yearInt = parseInt(year, 10);
    const monthInt = parseInt(month, 10);

    // Calculate start and end of the month
    const startDate = new Date(yearInt, monthInt - 1, 1); // First day of the month
    const endDate = new Date(yearInt, monthInt, 1); // First day of next month

    const numberOfDays = (endDate - startDate) / (1000 * 3600 * 24); // Correct calculation for number of days in month

    // Fetch all users
    const users = await User.find({});
    const results = [];

    for (const user of users) {
      const id = user._id;
      const basicSalData = user.basicSal;
      const UserId = user._id;
      const Name = user.name;

      const HalfSalData = await MiddleSal.find({
        createdAt: { $gte: startDate, $lt: endDate },
        Uid: id
      });

      const HalfDayData = await HalfDay.find({
        createdAt: { $gte: startDate, $lt: endDate },
        userId: id
      });

      const AttendanceData = await Attendance.find({
        createdAt: { $gte: startDate, $lt: endDate },
        userId: id
      });

      const LeaveData1 = await LeaveData.find({
        createdAt: { $gte: startDate, $lt: endDate },
        LeaveHolderId: id
      });

      // Leave data summary
      const leaveStatus = LeaveData1?.map(record => record.status);
      const leaveDays = leaveStatus.filter(status => status === 'true').length;
      const leaveDaysFalse = leaveStatus.filter(status => status === 'false').length;

      // Attendance Summary
      const attendanceStatus = AttendanceData?.map(record => record.status);
      const presentDays = attendanceStatus.filter(status => status === 'Present').length;
      const absentDays = attendanceStatus.filter(status => status === 'HalfDay').length;

      // Half Day Data Summary
      const halfDayCount = HalfDayData?.map(record => record.status);
      const halfDayFalse = halfDayCount.filter(status => status === 'false').length;
      const halfDayTrue = halfDayCount.filter(status => status === 'true').length;

      // Calculate the per day salary based on the number of days in the month
      const daysInMonth = new Date(yearInt, monthInt, 0).getDate();
      const PerDaySal = basicSalData / daysInMonth;

      // Calculate Full and Half Day Salary
      const fullHalfDayCount = halfDayTrue * PerDaySal;

      // Calculate the Accepted Half Salary
      const AcceptedHalfSal = HalfSalData?.map(salData => salData.Salary)
        .reduce((sum, val) => sum + val, 0); // Sum the values for accepted half salary

      // Calculate EPF, ETF, and NoPaySalary
      const EpF = basicSalData * 0.08;
      const ETF = basicSalData * 0.03;  // Only paid by company
      const NoPaySal = ((numberOfDays - (presentDays + absentDays) - leaveDays) * PerDaySal);

      // Calculate NoPayDays (the days where the user had no pay, i.e., absent, half day, or leave)
      const NoPayDays = numberOfDays - (presentDays + halfDayTrue + leaveDays);
      console.log("NoPayDays for", Name, ":", NoPayDays);

      // Add this user's results to the array
      results.push({
        UserId: UserId,
        name: Name,
        NoPayDays: NoPayDays, // Store the NoPayDays count
        NetSalary: basicSalData - EpF - fullHalfDayCount - NoPaySal - AcceptedHalfSal,
        NoPay: NoPaySal,
      });
    }

    // Find the user with the highest and lowest NoPayDays
    const highestNoPayUser = results.reduce((max, user) => (user.NoPayDays > max.NoPayDays ? user : max), results[0]);
    const lowestNoPayUser = results.reduce((min, user) => (user.NoPayDays < min.NoPayDays ? user : min), results[0]);

    // Send response with the highest and lowest NoPayDays data
    res.status(200).json({
      highestNoPayUser: {
        name: highestNoPayUser.name,
        NoPayDays: highestNoPayUser.NoPayDays,
      },
      lowestNoPayUser: {
        name: lowestNoPayUser.name,
        NoPayDays: lowestNoPayUser.NoPayDays,
      },
    });

  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data' });
    console.error("Error:", error);
  }
});


//get the all usersdata with there relavant EMPID,AttendDAta,NopayDate
router.get('/getAllUsersAttendanceNoPay/:year/:month', verifyToken, authorizeRoles(
  'Admin', 'Maneger', 'Headchef', 'Subchef', 'Supervisior', 'Waiter', 'Helper'
), async (req, res) => {
  const { year, month } = req.params;
  console.log("Year:", year, "Month:", month);

  try {
    // Convert year and month to integers
    const yearInt = parseInt(year, 10);
    const monthInt = parseInt(month, 10);

    // Calculate start and end of the month
    const startDate = new Date(yearInt, monthInt - 1, 1); // First day of the month
    const endDate = new Date(yearInt, monthInt, 1); // First day of next month

    // Fetch all users
    const users = await User.find({});

    // Array to hold user data
    const userAttendanceNoPayData = [];

    for (const user of users) {
      const { _id, name } = user;
      const UserId = _id;
      const Name = name;
      
      // Fetch data for each user
      const AttendanceData = await Attendance.find({ 
        createdAt: { $gte: startDate, $lt: endDate },
        userId: _id,  
      });

      const LeaveData1 = await LeaveData.find({
        createdAt: { $gte: startDate, $lt: endDate },
        LeaveHolderId: _id,
      });

      // Leave data summary
      const leaveStatus = LeaveData1?.map(record => record.Status);
      const leaveDays = leaveStatus.filter(status => status === 'true').length;
      const leaveDaysFalse = leaveStatus.filter(status => status === 'false').length;

      // Attendance summary
      const attendanceStatus = AttendanceData?.map(record => record.status);
      const presentDays = attendanceStatus.filter(status => status === 'Present').length;

      // Calculate NoPay days (days that are not present, absent, or on leave)
      const noPayDays = (new Date(yearInt, monthInt, 0).getDate() - (presentDays + leaveDays + leaveDaysFalse));

      // Add the user data to the array
      userAttendanceNoPayData.push({
        Name: Name,
        empId: UserId,
        attendedDays: presentDays,
        noPayDays: noPayDays,
      });
    }

    // Send the response with all user attendance and no pay data
    res.status(200).json({
      year: yearInt,
      month: monthInt,
      userAttendanceNoPayData,
    });

  } catch (error) {
    res.status(500).json({ message: 'Error fetching data for all users' });
    console.error("Error:", error);
  }
});


//get aproved leave data
// Get approved leave data
router.get('/getApprovedLeaveData', verifyToken, authorizeRoles('Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor', 'Waiter', 'Helper'), async (req, res) => {
  
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // First day of the current month
  const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0); // Last day of the current month
  
  try {
    // Step 1: Filter approved leaves and group them by LeaveHolderId
    const approvedLeaves = await LeaveData.aggregate([
      {
        $match: { 
          status: "true", 
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: "$LeaveHolderId",
          approvedCount: { $sum: 1 }
        }
      },
      {
        $sort: { approvedCount: -1 }
      }
    ]);

    if (approvedLeaves.length === 0) {
      return res.status(404).json({ message: "No approved leaves found" });
    }

    // Step 2: Get top and bottom users
    const highest = approvedLeaves[0];
    const lowest = approvedLeaves[approvedLeaves.length - 1];

    console.log("Highest:", highest);
    console.log("Lowest:", lowest);

    // Step 3: Fetch user info
    const highestUser = await User.findById(highest._id).select("name");
    const lowestUser = await User.findById(lowest._id).select("name");

    // Step 4: Send response
    res.status(200).json({
      highestLeave: {
        LeaveHolderId: highest._id,
        name: highestUser ? highestUser.name : "Unknown",
        approvedLeaveCount: highest.approvedCount
      },
      lowestLeave: {
        LeaveHolderId: lowest._id,
        name: lowestUser ? lowestUser.name : "Unknown",
        approvedLeaveCount: lowest.approvedCount
      }
    });

  } catch (error) {
    console.error("Error fetching approved leave data:", error);
    res.status(500).json({ message: 'Server error while retrieving leave data' });
  }
});


//get the all users attendence data
router.get('/getAllApprovedLeaveCounts', verifyToken, authorizeRoles('Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor', 'Waiter', 'Helper'), async (req, res) => {
  
  const startDate = new Date(yearInt, monthInt - 1, 1); // First day of the month
  const endDate = new Date(yearInt, monthInt, 1); // First day of next month
  
  try {
    // Step 1: Get approved leaves grouped by LeaveHolderId
    const approvedLeaveData = await LeaveData.aggregate([
      {
        $match: { status: "true" },
        createdAt: { $gte: startDate, $lte: endDate }
      },
      {
        $group: {
          _id: "$LeaveHolderId",
          approvedCount: { $sum: 1 }
        }
      },
      {
        $sort: { approvedCount: -1 }
      }
    ]);

    if (approvedLeaveData.length === 0) {
      return res.status(404).json({ message: "No approved leave data found" });
    }

    // Step 2: For each grouped result, get the user's name
    const result = await Promise.all(
      approvedLeaveData.map(async (entry) => {
        const user = await User.findById(entry._id).select("name");
        return {
          LeaveHolderId: entry._id,
          name: user ? user.name : "Unknown",
          approvedLeaveCount: entry.approvedCount
        };
      })
    );

    // Step 3: Send response
    res.status(200).json(result);

  } catch (error) {
    console.error("Error fetching all approved leave counts:", error);
    res.status(500).json({ message: 'Server error while retrieving approved leave counts' });
  }
});

//get Minimum Halfday users and Maximum Halfday users
router.get('/getMinAndMaxHalfDayUsers', verifyToken, authorizeRoles('Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor', 'Waiter', 'Helper'), async (req, res) => {
    
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // First day of the current month
  const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  try {
    // Step 1: Get half-day users grouped by userId
    const halfDayData = await HalfDay.aggregate([
      // Step 1: Match only users with 'true' status
      {
        $match: {
          status: "true" ,// Only include records where the status is 'true'
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: "$userId", // Group by userId
          halfDayCount: { $sum: 1 }, // Count the number of half-day requests
        }
      },
      {
        $sort: { halfDayCount: -1 } // Sort by halfDayCount in descending order (highest count first)
      }
    ]);

    if (halfDayData.length === 0) {
      return res.status(404).json({ message: "No half-day data found" });
    }

    // Step 2: Get the user with the minimum and maximum half-days
    const minHalfDayUser = halfDayData[0];
    const maxHalfDayUser = halfDayData[halfDayData.length - 1];

    console.log("Min Half-Day User:", minHalfDayUser);
    console.log("Max Half-Day User:", maxHalfDayUser);

    // Step 3: Fetch user info
    const minUser = await User.findById(minHalfDayUser._id).select("name");
    const maxUser = await User.findById(maxHalfDayUser._id).select("name");

    // Step 4: Send response
    res.status(200).json({
      minHalfDayUser: {
        userId: minHalfDayUser._id,
        name: minUser ? minUser.name : "Unknown",
        halfDayCount: minHalfDayUser.halfDayCount
      },
      maxHalfDayUser: {
        userId: maxHalfDayUser._id,
        name: maxUser ? maxUser.name : "Unknown",
        halfDayCount: maxHalfDayUser.halfDayCount
      }
    });

  } catch (error) {
    console.error("Error fetching half-day data:", error);
    res.status(500).json({ message: 'Server error while retrieving half-day data' });
  }
});


//get all the aproved halfDay data
router.get('/getAllApprovedHalfDayRequests', verifyToken, authorizeRoles('Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor', 'Waiter', 'Helper'), async (req, res) => {
  try {
    // Step 1: Fetch all half-day records where status is 'true' (approved half-day requests)
    const approvedHalfDayData = await HalfDay.find({
      status: "true", // Filter for approved half-day requests
    });

    // If no approved half-day records are found, send a message
    if (approvedHalfDayData.length === 0) {
      return res.status(404).json({ message: "No approved half-day data found" });
    }

    const usersName = await Promise.all(
      approvedHalfDayData.map(async (record) => {
        const user = await User.findById(record.userId).select("name");
        return {
          userId: record.userId,
          name: user ? user.name : "Unknown",
          date: record.date,
          whichHalf: record.whichHalf,
        };
      })
    );

    // Step 2: Send the fetched data as a response
    res.status(200).json({
      approvedHalfDayData: usersName
    });
  } catch (error) {
    console.error("Error fetching approved half-day data:", error);
    res.status(500).json({ message: 'Server error while retrieving approved half-day data' });
  }
});


//Get maximum and minimum of the not aprooved Halfday list
router.get('/getMinAndMaxNotAproved', verifyToken, authorizeRoles('Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor', 'Waiter', 'Helper'), async (req, res) => {
 
  
  const currentDate = new Date();
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);  // First day of the current month
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);  // Last day of the current month

  try {
    // Step 1: Get half-day users grouped by userId
    const halfDayData = await HalfDay.aggregate([
      // Step 1: Match only users with 'true' status
      {
        $match: {
          status: "false", // Only include records where the status is 'true'
          createdAt: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: "$userId", // Group by userId
          halfDayCount: { $sum: 1 }, // Count the number of half-day requests
        }
      },
      {
        $sort: { halfDayCount: -1 } // Sort by halfDayCount in descending order (highest count first)
      }
    ]);

    if (halfDayData.length === 0) {
      return res.status(404).json({ message: "No half-day data found" });
    }

    // Step 2: Get the user with the minimum and maximum half-days
    const minHalfDayUser = halfDayData[0];
    const maxHalfDayUser = halfDayData[halfDayData.length - 1];

    console.log("Min Half-Day User:", minHalfDayUser);
    console.log("Max Half-Day User:", maxHalfDayUser);

    // Step 3: Fetch user info
    const minUser = await User.findById(minHalfDayUser._id).select("name");
    const maxUser = await User.findById(maxHalfDayUser._id).select("name");

    // Step 4: Send response
    res.status(200).json({
      minHalfDayUser: {
        userId: minHalfDayUser._id,
        name: minUser ? minUser.name : "Unknown",
        halfDayCount: minHalfDayUser.halfDayCount
      },
      maxHalfDayUser: {
        userId: maxHalfDayUser._id,
        name: maxUser ? maxUser.name : "Unknown",
        halfDayCount: maxHalfDayUser.halfDayCount
      }
    });

  } catch (error) {
    console.error("Error fetching half-day data:", error);
    res.status(500).json({ message: 'Server error while retrieving half-day data' });
  }
});


//get all the not aproved halfDay data
router.get('/getAllNotApprovedHalfDayRequests', verifyToken, authorizeRoles('Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor', 'Waiter', 'Helper'), async (req, res) => {
  try {
    // Step 1: Fetch all half-day records where status is 'true' (approved half-day requests)
    const approvedHalfDayData = await HalfDay.find({
      status: "false", // Filter for approved half-day requests
    });

    // If no approved half-day records are found, send a message
    if (approvedHalfDayData.length === 0) {
      return res.status(404).json({ message: "No approved half-day data found" });
    }

    const usersName = await Promise.all(
      approvedHalfDayData.map(async (record) => {
        const user = await User.findById(record.userId).select("name");
        return {
          userId: record.userId,
          name: user ? user.name : "Unknown",
          date: record.date,
          whichHalf: record.whichHalf,
        };
      })
    );

    // Step 2: Send the fetched data as a response
    res.status(200).json({
      approvedHalfDayData: usersName
    });
  } catch (error) {
    console.error("Error fetching approved half-day data:", error);
    res.status(500).json({ message: 'Server error while retrieving approved half-day data' });
  }
});



//get Not aproved leave data(Highest and Lowest)
router.get('/getNotApprovedLeaveData', verifyToken, authorizeRoles('Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor', 'Waiter', 'Helper'), async (req, res) => {
 
  const currentDate = new Date();
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);  // First day of the current month
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);  // Last day of the current month
 
  try {
    // Step 1: Filter approved leaves and group them by LeaveHolderId
    const approvedLeaves = await LeaveData.aggregate([
      {
        $match: { status: "false" },
        createdAt: { $gte: startOfMonth, $lte: endOfMonth }
      },
      {
        $group: {
          _id: "$LeaveHolderId",
          approvedCount: { $sum: 1 }
        }
      },
      {
        $sort: { approvedCount: -1 }
      }
    ]);

    if (approvedLeaves.length === 0) {
      return res.status(404).json({ message: "No approved leaves found" });
    }

    // Step 2: Get top and bottom users
    const highest = approvedLeaves[0];
    const lowest = approvedLeaves[approvedLeaves.length - 1];

    console.log("Highest:", highest);
    console.log("Lowest:", lowest);

    // Step 3: Fetch user info
    const highestUser = await User.findById(highest._id).select("name");
    const lowestUser = await User.findById(lowest._id).select("name");

    // Step 4: Send response
    res.status(200).json({
      highestLeave: {
        LeaveHolderId: highest._id,
        name: highestUser ? highestUser.name : "Unknown",
        approvedLeaveCount: highest.approvedCount
      },
      lowestLeave: {
        LeaveHolderId: lowest._id,
        name: lowestUser ? lowestUser.name : "Unknown",
        approvedLeaveCount: lowest.approvedCount
      }
    });

  } catch (error) {
    console.error("Error fetching approved leave data:", error);
    res.status(500).json({ message: 'Server error while retrieving leave data' });
  }
});


//get the all users Not attendence data
router.get('/getAllNotApprovedHalfDayRequests', verifyToken, authorizeRoles('Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor', 'Waiter', 'Helper'), async (req, res) => {
  try {
    // Step 1: Fetch all half-day records where status is 'true' (approved half-day requests)
    const approvedHalfDayData = await LeaveData.find({
      status: "false", // Filter for approved half-day requests
    });

    // If no approved half-day records are found, send a message
    if (approvedHalfDayData.length === 0) {
      return res.status(404).json({ message: "No approved half-day data found" });
    }

    const usersName = await Promise.all(
      approvedHalfDayData.map(async (record) => {
        const user = await User.findById(record.userId).select("name");
        return {
          userId: record.userId,
          name: user ? user.name : "Unknown",
          date: record.date,
          whichHalf: record.whichHalf,
        };
      })
    );

    // Step 2: Send the fetched data as a response
    res.status(200).json({
      approvedHalfDayData: usersName
    });
  } catch (error) {
    console.error("Error fetching approved half-day data:", error);
    res.status(500).json({ message: 'Server error while retrieving approved half-day data' });
  }
});


//get the aproved Advance payment data mimum user and maximum user
router.get('/getMinAndMaxAdvancePaymentUsers', verifyToken, authorizeRoles('Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor', 'Waiter', 'Helper'), async (req, res) => {
  try {
    // Get the current date and calculate the first day and last day of the current month
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);  // First day of the current month
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);  // Last day of the current month

    // Step 1: Fetch users with 'true' status and filter based on createdAt being in the current month
    const halfDayData = await MiddleSal.aggregate([
      {
        $match: {
          Status: "true", // Only include records where the status is 'true'
          createdAt: { $gte: startOfMonth, $lte: endOfMonth } // Filter based on createdAt in the current month
        }
      },
      {
        $sort: { Salary: -1 } // Sort by Salary in descending order (highest salary first)
      }
    ]);

    console.log("Half Day Data:", halfDayData);

    if (halfDayData.length === 0) {
      return res.status(404).json({ message: "No approved half-day data found for the current month" });
    }

    // Step 2: Get the user with the highest salary (first in the array after sorting)
    const maxSalaryUser = halfDayData[0];

    // Step 3: Get the user with the lowest salary (last in the array after sorting)
    const minSalaryUser = halfDayData[halfDayData.length - 1];

    // Step 4: Fetch user info by userId for both max and min salary users
    const maxUser = await User.findById(maxSalaryUser._id).select("name");
    const minUser = await User.findById(minSalaryUser._id).select("name");

    // Step 5: Send the response with the highest and lowest salary users
    res.status(200).json({
      maxSalaryUser: {
        userId: maxSalaryUser._id,
        name: maxUser ? maxUser.name : "Unknown",
        Salary: maxSalaryUser.Salary
      },
      minSalaryUser: {
        userId: minSalaryUser._id,
        name: minUser ? minUser.name : "Unknown",
        Salary: minSalaryUser.Salary
      }
    });
  } catch (error) {
    console.error("Error fetching min and max salary users:", error);
    res.status(500).json({ message: "Error fetching salary data" });
  }
});


//get the all users Advance payment data
router.get('/getAllUsersAdvancePayment', verifyToken, authorizeRoles('Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor', 'Waiter', 'Helper'), async (req, res) => {
  try {
    // Get the current date and calculate the first day and last day of the current month
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);  // First day of the current month
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);  // Last day of the current month

    // Step 1: Fetch users with 'true' status and filter based on createdAt being in the current month
    const usersData = await MiddleSal.aggregate([
      {
        $match: {
          Status: "true", // Only include records where the status is 'true'
          createdAt: { $gte: startOfMonth, $lte: endOfMonth } // Filter based on createdAt in the current month
        }
      },
      {
        $project: {
          _id: 1,  // Include _id
          Name: 1,  // Include user name
          Salary: 1, // Include email (You can adjust the fields you want to return)
          createdAt: 1,  // Include createdAt date for debugging
          Status: 1,  // Include Status
        }
      }
    ]);

    if (usersData.length === 0) {
      return res.status(404).json({ message: "No users found with 'true' status for the current month" });
    }

    // Step 2: Return the data
    res.status(200).json({ usersData });

  } catch (error) {
    console.error("Error fetching users with true status:", error);
    res.status(500).json({ message: "Error fetching users with true status" });
  }
});


//get the all users HalfDay data
router.get('/getAllUsersHalfDayData', verifyToken, authorizeRoles('Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor', 'Waiter', 'Helper'), async (req, res) => {
  try {
    // Get the current date and calculate the first day and last day of the current month
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);  // First day of the current month
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);  // Last day of the current month

    // Step 1: Fetch users with 'true' status and filter based on createdAt being in the current month
    const usersData = await HalfDay.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lte: endOfMonth }, // Filter based on createdAt in the current month
          status: { $in: ["true", "Non","false"] }, // Only include records where the status is 'true'
        }
      },
      {
        $project: {
          _id: 1,  // Include _id
          userId: 1,  // Include user ID
          date: 1, // Include date
          whichHalf: 1,  // Include whichHalf
          status: 1,  // Include status
        }
      }
    ]);

    if (usersData.length === 0) {
      return res.status(404).json({ message: "No users found with 'true' status for the current month" });
    }

    // Fetch the user details (name) for each HalfDay record
    const users = await Promise.all(
      usersData.map(async (record) => {
        const user = await User.findById(record.userId).select("name");
        return {
          _id: record._id,
          userId: record.userId,
          name: user ? user.name : "Unknown",
          date: record.date,
          status: record.status,
          whichHalf: record.whichHalf,
        };
      })
    );

    // Step 2: Return the data
    res.status(200).json({ users });

  } catch (error) {
    console.error("Error fetching users with true status:", error);
    res.status(500).json({ message: "Error fetching users with true status" });
  }
});


//update halfday data
router.put('/updateHalfDayData/:id', verifyToken, authorizeRoles('Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor', 'Waiter', 'Helper'), async (req, res) => {
  const { id } = req.params;
  const { status,reason} = req.body;
  try{

    const halfDayData=await HalfDay.findByIdAndUpdate(id,{
      status:status,
      reason:reason
    },{new:true});

    if(!halfDayData){
      return res.status(404).json({message:"HalfDay data not found"});
    }

    res.status(200).json({"message":"HalfDay data updated successfully"});

    }catch(error){
      console.error("Error:",error);
      res.status(500).json({message:"Internal Server Error"});
    }
});


//get all allowance data
router.get('/getAllowances', verifyToken, authorizeRoles('Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor', 'Waiter', 'Helper'), async (req, res) => {
     
      try{
        const allowanceData=await Allowance.find({});

        if(allowanceData.length===0){
          return res.status(404).json({message:"No allowance data found"});
        }

        res.status(200).json({allowanceData});

      }catch(error){
        console.error("Error:",error);
        res.status(500).json({message:"Internal Server Error"});
      }
});


//Add data to payment
router.post('/addPaymentData', verifyToken, authorizeRoles('Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor', 'Waiter', 'Helper'), async (req, res) => {
  const { userId, serviceCharge,  allowance,} = req.body;
  try {
    const paymentData = await Payments.create({
      userId,
      serviceCharge, 
      allowance,
    });

    res.status(201).json({ message: 'Payment data added successfully', paymentData });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get current user's payment data for the current month
router.get('/getAllPaymentData/:userId', verifyToken, authorizeRoles('Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor', 'Waiter', 'Helper'), async (req, res) => {
  try {
    const {userId} =req.params; // Assuming the user ID is attached to the request after the token is verified
    console.log("User ID:", userId);
    // Get the current date and calculate the first and last day of the current month
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);  // First day of the current month
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);  // Last day of the current month

    // Find payment data for the current user in the current month
    const paymentData = await Payments.find({
     // Match the user ID
     createdAt: { $gte: startOfMonth, $lte: endOfMonth },  // Match payments created within the current month
     userId: userId, 
    });

    if (paymentData.length === 0) {
      return res.status(404).json({ message: 'No payment data found for the current month' });
    }

    // Return the payment data
    res.status(200).json({ paymentData });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//Get all Users details
router.get('/AllRegUsersData', verifyToken, authorizeRoles('Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor', 'Waiter', 'Helper'), async (req, res) => {
  try {
    const users = await User.find({});

    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});




module.exports=router;